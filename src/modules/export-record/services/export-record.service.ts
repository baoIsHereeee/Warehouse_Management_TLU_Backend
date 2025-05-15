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

@Injectable()
export class ExportService {
    constructor(
        private exportRepository: ExportRepository,
        private exportDetailRepository: ExportDetailRepository,
        private userRepository: UserRepository,
        private customerRepository: CustomerRepository,
        private dataSource: DataSource,
        private mailService: MailService
    ) {}

    async getAllExportRecords(options: IPaginationOptions, query?: string): Promise<Pagination<ExportRecord>> {
        const queryBuilder = this.exportRepository.createQueryBuilder('export');

        if (query) queryBuilder.where('LOWER(export.id) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<ExportRecord>(queryBuilder, options);
    }

    async getExportRecordById(id: string) {
        return await this.exportRepository.findOne({ where: { id }, relations: ['exportDetails', 'exportDetails.product'] });
    }

    async createExportRecord(createData: CreateExportDTO) {
        const currentUser = await this.userRepository.findOne({ where: { id: createData.userId } });
        if (!currentUser) throw new NotFoundException('User not found! Cannot create export record! Please try again!');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let savedExportRecord: ExportRecord;

        try {
            const exportRepository = queryRunner.manager.getRepository(ExportRecord);
            const exportDetailRepository = queryRunner.manager.getRepository(ExportDetail);
            const customerRepository = queryRunner.manager.getRepository(Customer);
            const warehouDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const productRepository = queryRunner.manager.getRepository(Product);
    
            const newExportRecord = exportRepository.create({
                user: currentUser,
                customer: createData.customerId ? await customerRepository.findOne({ where: { id: createData.customerId } }) : null,
                description: createData.description,
            });
    
            savedExportRecord = await exportRepository.save(newExportRecord);
    
            for (const exportDetail of createData.exportDetails) {
                const productWarehouse = await warehouDetailRepository.findOne({ where: { productId: exportDetail.productId, warehouseId: exportDetail.warehouseId }, relations: ['product', 'warehouse'] }); 
                if (!productWarehouse) throw new NotFoundException('Product not found in warehouse! Cannot create export record! Please try again!');
    
                if (exportDetail.quantity > productWarehouse.quantity) throw new BadRequestException(`Quantity ${exportDetail.quantity} exceeds available stock ${productWarehouse.product.currentStock} for ${productWarehouse.product.name}! Please try again!`);
                productWarehouse.quantity -= exportDetail.quantity;
                await warehouDetailRepository.save(productWarehouse);
    
                productWarehouse.product.currentStock -= exportDetail.quantity;
                await productRepository.save(productWarehouse.product);
                
                const newExportDetail = exportDetailRepository.create({
                    exportRecord: savedExportRecord,
                    quantity: exportDetail.quantity,
                    sellingPrice: exportDetail.sellingPrice,
                    product: productWarehouse.product,
                    warehouse: productWarehouse.warehouse,
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

        const fullExportRecord = await this.exportRepository.findOne({ where: { id: savedExportRecord.id }, relations: ['exportDetails', 'exportDetails.product', 'exportDetails.warehouse', 'user', 'customer'] });
        await this.mailService.sendCreateExportEmail(fullExportRecord!);
    }

    async updateExportRecord(id: string, updateData: UpdateExportDTO) {
        const exportRecord = await this.exportRepository.findOne({ where: { id }, relations: ['exportDetails', 'exportDetails.product', 'exportDetails.warehouse'] });
        if (!exportRecord) throw new Error('Export record not found');

        if (!updateData.exportDetails) {
            const customer = await this.customerRepository.findOne({ where: { id: updateData.customerId } });
            if (!customer) throw new NotFoundException('Customer not found! Cannot update export record! Please try again!');

            const { customerId, ...rest } = updateData;
            const newUpdateData = { ...rest, customer };

            return await this.exportRepository.update(id, newUpdateData);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const exportDetailRepository = queryRunner.manager.getRepository(ExportDetail);
            const warehouDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const productRepository = queryRunner.manager.getRepository(Product);

            for (const exportDetail of exportRecord.exportDetails) {
                const product = await productRepository.findOne({ where: { id: exportDetail.product.id } });
                product!.currentStock += exportDetail.quantity;
                await productRepository.save(product!);
    
                const productWarehouse = await warehouDetailRepository.findOne({ where: { productId: exportDetail.product.id, warehouseId: exportDetail.warehouse.id }});
                productWarehouse!.quantity += exportDetail.quantity;
                await warehouDetailRepository.save(productWarehouse!);
            }
    
            await exportDetailRepository.createQueryBuilder().delete().from('export_details').where('export_record_id = :id', { id }).execute();
    
            for (const newExportDetail of updateData.exportDetails) {
                const productWarehouse = await warehouDetailRepository.findOne({ where: { productId: newExportDetail.productId, warehouseId: newExportDetail.warehouseId }, relations: ['product', 'warehouse'] });
                if (!productWarehouse) throw new NotFoundException('Product not found in warehouse! Cannot update export record! Please try again!');
    
                if (newExportDetail.quantity > productWarehouse.quantity) throw new BadRequestException(`Quantity ${newExportDetail.quantity} exceeds available stock ${productWarehouse.product.currentStock} for ${productWarehouse.product.name}! Please try again!`);
                productWarehouse.quantity -= newExportDetail.quantity;
                await warehouDetailRepository.save(productWarehouse);
    
                productWarehouse.product.currentStock -= newExportDetail.quantity;
                await productRepository.save(productWarehouse.product);
    
                const newExportDetailEntity = this.exportDetailRepository.create({
                    exportRecord: exportRecord,
                    quantity: newExportDetail.quantity,
                    sellingPrice: newExportDetail.sellingPrice,
                    product: productWarehouse.product,
                    warehouse: productWarehouse.warehouse,
                });
    
                await exportDetailRepository.save(newExportDetailEntity);
            }
    
            const { exportDetails, ...rest } = updateData;
            await this.exportRepository.update(id, rest);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
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
