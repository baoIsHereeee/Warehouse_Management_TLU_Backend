import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import ExportRepository  from '../repositories/export.repository';
import ExportDetailRepository from '../repositories/export-detail.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ExportRecord } from '../entities/export.entity';
import { CreateExportDTO, UpdateExportDTO } from '../dtos';
import UserRepository from '../../..//modules/user/repositories/user.repository';
import CustomerRepository from '../../..//modules/customer/repositories/customer.repository';
import { DataSource } from 'typeorm';
import { ExportDetail } from '../entities/export-detail.entity';
import { Customer } from '../../..//modules/customer/entities/customer.entity';
import { WarehouseDetail } from '../../..//modules/warehouse/entities/warehouse-detail.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { MailService } from '../../..//modules/mail/services/mail.service';
import { UtilService } from 'src/modules/util/services/util.service';

@Injectable()
export class ExportService {
    constructor(
        private exportRepository: ExportRepository,
        private exportDetailRepository: ExportDetailRepository,
        private userRepository: UserRepository,
        private customerRepository: CustomerRepository,
        private dataSource: DataSource,
        private mailService: MailService,
        private utilService: UtilService
    ) {}

    async getAllExportRecords(options: IPaginationOptions, tenantId: string, query?: string): Promise<Pagination<ExportRecord>> {
        const queryBuilder = this.exportRepository.createQueryBuilder('export');

        queryBuilder.where('export.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.andWhere('LOWER(export.description) LIKE :query', { query: `%${query.toLowerCase()}%` });

        queryBuilder.orderBy('export.updatedAt', 'DESC');

        return paginate<ExportRecord>(queryBuilder, options);
    }

    async getExportRecordById(id: string) {
        return await this.exportRepository.findOne({ where: { id }, relations: ['exportDetails', 'exportDetails.product', 'customer', 'exportDetails.warehouse', 'user'] });
    }

    async createExportRecord(createData: CreateExportDTO, tenantId: string) {
        const currentUser = await this.userRepository.findOne({ where: { id: createData.userId, tenant: { id: tenantId } } });
        if (!currentUser) throw new NotFoundException('User not found! Cannot create export record! Please try again!');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        let savedExportRecord: ExportRecord;

        let warehouseDetails: WarehouseDetail[] = [];

        try {
            const exportRepository = queryRunner.manager.getRepository(ExportRecord);
            const exportDetailRepository = queryRunner.manager.getRepository(ExportDetail);
            const customerRepository = queryRunner.manager.getRepository(Customer);
            const warehouDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const productRepository = queryRunner.manager.getRepository(Product);
    
            const newExportRecord = exportRepository.create({
                user: currentUser,
                customer: createData.customerId ? await customerRepository.findOne({ where: { id: createData.customerId, tenant: { id: tenantId } } }) : null,
                description: createData.description,
                tenant: { id: tenantId }
            });
    
            savedExportRecord = await exportRepository.save(newExportRecord);
    
            for (const exportDetail of createData.exportDetails) {
                const productWarehouse = await warehouDetailRepository
                    .createQueryBuilder('warehouseDetail')
                    .innerJoinAndSelect('warehouseDetail.product', 'product')
                    .innerJoinAndSelect('warehouseDetail.warehouse', 'warehouse')
                    .where('warehouseDetail.productId = :productId', { productId: exportDetail.productId })
                    .andWhere('warehouseDetail.warehouseId = :warehouseId', { warehouseId: exportDetail.warehouseId })
                    .setLock('pessimistic_write')
                    .getOne();

                if (!productWarehouse) throw new NotFoundException('Product not found in warehouse! Cannot create export record! Please try again!');

                warehouseDetails.push(productWarehouse);

                const lockedProduct = await productRepository.findOne({
                    where: { id: productWarehouse.product.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!lockedProduct) throw new NotFoundException('Product not found!');
    
                if (exportDetail.quantity > productWarehouse.quantity) throw new BadRequestException(`Quantity [${exportDetail.quantity}] exceeds available stock [${productWarehouse.quantity}] for [${productWarehouse.product.name}]! Please try again!`);
                productWarehouse.quantity -= exportDetail.quantity;
                await warehouDetailRepository.save(productWarehouse);
    
                lockedProduct.currentStock -= exportDetail.quantity;
                await productRepository.save(lockedProduct);
                
                const newExportDetail = exportDetailRepository.create({
                    exportRecord: savedExportRecord,
                    quantity: exportDetail.quantity,
                    sellingPrice: exportDetail.sellingPrice,
                    product: productWarehouse.product,
                    warehouse: productWarehouse.warehouse,
                    tenant: { id: tenantId }
                });
                
                await exportDetailRepository.save(newExportDetail);
            }
            
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        const fullExportRecord = await this.exportRepository.findOne({ where: { id: savedExportRecord.id }, relations: ['exportDetails', 'exportDetails.product', 'exportDetails.warehouse', 'user', 'customer', 'tenant'] });
        this.mailService.sendCreateExportEmail(fullExportRecord!);
        this.utilService.alertMinimumStock(warehouseDetails);
    }

    async updateExportRecord(id: string, updateData: UpdateExportDTO, tenantId: string) {
        let oldExportRecord: ExportRecord;

        let warehouseDetails: WarehouseDetail[] = [];

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        try {
            const exportRepository = queryRunner.manager.getRepository(ExportRecord);
            const exportDetailRepository = queryRunner.manager.getRepository(ExportDetail);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const productRepository = queryRunner.manager.getRepository(Product);

            // First get the export record with lock
            const exportRecord = await exportRepository
                .createQueryBuilder('export')
                .innerJoinAndSelect('export.user', 'user')  
                .where('export.id = :id', { id })
                .setLock('pessimistic_write')
                .getOne();

            if (!exportRecord) throw new NotFoundException(`Export with id ${id} not found! Please try again!`);

            // Then get the export details separately
            const oldExportDetails = await exportDetailRepository
                .createQueryBuilder('exportDetail')
                .innerJoinAndSelect('exportDetail.product', 'product')
                .innerJoinAndSelect('exportDetail.warehouse', 'warehouse')
                .where('exportDetail.exportRecord.id = :id', { id })
                .getMany();

            exportRecord.exportDetails = oldExportDetails;

            const exportCustomer = await exportRepository.findOne({ where: { id, tenant: { id: tenantId } }, relations: ['customer'] });
            exportRecord.customer = exportCustomer!.customer;

            oldExportRecord = exportRecord;

            for (const exportDetail of exportRecord.exportDetails) {
                const product = await productRepository.findOne({ where: { id: exportDetail.product.id }, lock: { mode: 'pessimistic_write' } });
                product!.currentStock += exportDetail.quantity;
                await productRepository.save(product!);
    
                const productWarehouse = await warehouseDetailRepository.findOne({ where: { productId: exportDetail.product.id, warehouseId: exportDetail.warehouse.id }, lock: { mode: 'pessimistic_write' }});
                productWarehouse!.quantity += exportDetail.quantity;
                await warehouseDetailRepository.save(productWarehouse!);
            }
    
            await exportDetailRepository.createQueryBuilder().delete().from('export_details').where('export_record_id = :id', { id }).execute();
    
            for (const newExportDetail of updateData.exportDetails) {
                const productWarehouse = await warehouseDetailRepository
                    .createQueryBuilder('warehouseDetail')
                    .innerJoinAndSelect('warehouseDetail.product', 'product')
                    .innerJoinAndSelect('warehouseDetail.warehouse', 'warehouse')
                    .where('warehouseDetail.productId = :productId', { productId: newExportDetail.productId })
                    .andWhere('warehouseDetail.warehouseId = :warehouseId', { warehouseId: newExportDetail.warehouseId })
                    .setLock('pessimistic_write')
                    .getOne();

                if (!productWarehouse) throw new NotFoundException('Product not found in warehouse! Cannot update export record! Please try again!');
    
                if (newExportDetail.quantity > productWarehouse.quantity) throw new BadRequestException(`Quantity ${newExportDetail.quantity} exceeds available stock ${productWarehouse.quantity} for ${productWarehouse.product.name}! Please try again!`);
                productWarehouse.quantity -= newExportDetail.quantity;
                await warehouseDetailRepository.save(productWarehouse);

                warehouseDetails.push(productWarehouse);

                const lockedProduct = await productRepository.findOne({
                    where: { id: productWarehouse.product.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!lockedProduct) throw new NotFoundException('Product not found!');
    
                lockedProduct.currentStock -= newExportDetail.quantity;
                await productRepository.save(lockedProduct);
    
                const newExportDetailEntity = exportDetailRepository.create({
                    exportRecord: exportRecord,
                    quantity: newExportDetail.quantity,
                    sellingPrice: newExportDetail.sellingPrice,
                    product: productWarehouse.product,
                    warehouse: productWarehouse.warehouse,
                    tenant: { id: tenantId }
                });
    
                await exportDetailRepository.save(newExportDetailEntity);
            }

            const { exportDetails, customerId, userId, ...rest } = updateData;
            if (customerId) {
                const customer = await this.customerRepository.findOne({ where: { id: customerId, tenant: { id: tenantId } } });
                if (!customer) throw new NotFoundException('Customer not found! Cannot update export record! Please try again!');

                await exportRepository.update(id, { customer });
            }

            if (userId) {
                const user = await this.userRepository.findOne({ where: { id: userId, tenant: { id: tenantId } } });
                if (!user) throw new NotFoundException('User not found! Cannot update export record! Please try again!');

                await exportRepository.update(id, { user });
            }
                
            await exportRepository.update(id, rest);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        const updatedExportRecord = await this.exportRepository.findOne({ where: { id, tenant: { id: tenantId } }, relations: ['exportDetails', 'exportDetails.product', 'exportDetails.warehouse', 'user', 'customer', 'tenant'] });
        this.mailService.sendUpdateExportEmail(oldExportRecord, updatedExportRecord!);
        this.utilService.alertMinimumStock(warehouseDetails);
    }

    async deleteExportRecord(id: string) {
        const exportRecord = await this.exportRepository.findOne({ where: { id }, relations: ['exportDetails', 'exportDetails.product', 'exportDetails.warehouse'] });
        if (!exportRecord) throw new Error('Export record not found');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const exportDetailRepository = queryRunner.manager.getRepository(ExportDetail);
            const productRepository = queryRunner.manager.getRepository(Product);
            const warehouDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const exportRepository = queryRunner.manager.getRepository(ExportRecord);

            for (const exportDetail of exportRecord.exportDetails) {
                const product = await productRepository.findOne({ where: { id: exportDetail.product.id } });
                product!.currentStock += exportDetail.quantity;
                await productRepository.save(product!);

                const productWarehouse = await warehouDetailRepository.findOne({ where: { productId: exportDetail.product.id, warehouseId: exportDetail.warehouse.id }});
                productWarehouse!.quantity += exportDetail.quantity;
                await warehouDetailRepository.save(productWarehouse!);
            }

            await exportDetailRepository.createQueryBuilder().delete().from('export_details').where('export_record_id = :id', { id }).execute();
            await exportRepository.delete(id);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

}
