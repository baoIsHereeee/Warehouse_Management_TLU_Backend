import { Injectable, NotFoundException } from '@nestjs/common';
import { ImportRecord } from '../entities/import.entity';
import ImportRepository from '../repositories/import.repository';
import { DataSource } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateImportDTO, UpdateImportDTO } from '../dtos';
import { ImportDetail } from '../entities/import-detail.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Supplier } from '../../../modules/supplier/entities/supplier.entity';
import { WarehouseDetail } from '../../../modules/warehouse/entities/warehouse-detail.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { MailService } from '../../../modules/mail/services/mail.service';
import { UtilService } from '../../../modules/util/services/util.service';

@Injectable()
export class ImportRecordService {
    constructor(
        private importRepository: ImportRepository,
        private dataSource: DataSource,
        private mailService: MailService,
        private utilService: UtilService
    ) {}

    async getAllImportRecords(options: IPaginationOptions, tenantId: string, query?: string): Promise<Pagination<ImportRecord>> {
        const queryBuilder = this.importRepository.createQueryBuilder('import');

        queryBuilder.where('import.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.andWhere('LOWER(import.description) LIKE :query', { query: `%${query.toLowerCase()}%` });

        queryBuilder.orderBy('import.updatedAt', 'DESC');

        return paginate<ImportRecord>(queryBuilder, options);
    }

    async getImportRecordById(id: string) {
        const importRecord = await this.importRepository.findOne({
            where: { id },
            relations: ['importDetails', 'importDetails.product', 'importDetails.warehouse', 'supplier', 'user'],
        });

        if (!importRecord) throw new NotFoundException(`Import ${id} not found! Please try again!`);
        return importRecord;
    }

    async createImportRecord(createData: CreateImportDTO, tenantId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        let savedImportRecord: ImportRecord;

        try {
            const importRepository = queryRunner.manager.getRepository(ImportRecord);
            const importDetailRepository = queryRunner.manager.getRepository(ImportDetail);
            const userRepository = queryRunner.manager.getRepository(User);
            const supplierRepository = queryRunner.manager.getRepository(Supplier);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const productRepository = queryRunner.manager.getRepository(Product);

            const newImportRecord = importRepository.create({
                description: createData.description,
                supplier: createData.supplierId ? await supplierRepository.findOne({ where: { id: createData.supplierId, tenant: { id: tenantId } } }) : null,
                user: await userRepository.findOne({ where: { id: createData.userId, tenant: { id: tenantId } } }) as User,
                tenant: { id: tenantId }
            });

            savedImportRecord = await importRepository.save(newImportRecord);

            for (const newImportDetail of createData.importDetails) {
                // const productWarehouse = await warehouseDetailRepository.findOne({ where: { productId: newImportDetail.productId, warehouseId: newImportDetail.warehouseId }, relations: ['product'] });
                const productWarehouse = await warehouseDetailRepository
                    .createQueryBuilder('warehouseDetail')
                    .innerJoinAndSelect('warehouseDetail.product', 'product')
                    .where('warehouseDetail.productId = :productId', { productId: newImportDetail.productId })
                    .andWhere('warehouseDetail.warehouseId = :warehouseId', { warehouseId: newImportDetail.warehouseId })
                    .setLock('pessimistic_write')
                    .getOne();

                if (productWarehouse) {
                    productWarehouse.quantity += newImportDetail.quantity;
                    await warehouseDetailRepository.save(productWarehouse);

                    const lockedProduct = await productRepository.findOne({ 
                        where: { id: productWarehouse.product.id },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (!lockedProduct) throw new NotFoundException('Product not found! Please try again!');

                    lockedProduct.currentStock += newImportDetail.quantity;
                    await productRepository.save(lockedProduct);

                } else {
                    const products = await productRepository.findOne({ where: { id: newImportDetail.productId }, lock: { mode: 'pessimistic_write' } });
                    if (!products) throw new NotFoundException(`Product with id ${newImportDetail.productId} not found! Please try again!`);

                    const newWarehouseDetail = warehouseDetailRepository.create({
                        product: { id: newImportDetail.productId },
                        warehouse: { id: newImportDetail.warehouseId },
                        quantity: newImportDetail.quantity,
                        tenant: { id: tenantId }
                    });
                    await warehouseDetailRepository.save(newWarehouseDetail);
                    
                    products.currentStock += newImportDetail.quantity;
                    await productRepository.save(products);
                }

                const savedImportDetail = importDetailRepository.create({
                    quantity: newImportDetail.quantity,
                    importPrice: newImportDetail.importPrice,
                    product: { id: newImportDetail.productId },
                    warehouse: { id: newImportDetail.warehouseId },
                    importRecord: savedImportRecord,
                    tenant: { id: tenantId }
                });

                await importDetailRepository.save(savedImportDetail);
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        const importRecord = await this.importRepository.findOne({
            where: { id: savedImportRecord.id},
            relations: ['importDetails', 'importDetails.product', 'importDetails.warehouse', 'supplier', 'user', 'tenant'],
        });
        this.mailService.sendCreateImportEmail(importRecord!);
    }

    async updateImportRecord(id: string, updateData: UpdateImportDTO, tenantId: string) {
        let oldImportRecord: ImportRecord;
        const oldWarehouseDetails: WarehouseDetail[] = [];
        const newWarehouseDetails: WarehouseDetail[] = [];

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const importRepository = queryRunner.manager.getRepository(ImportRecord);
            const importDetailRepository = queryRunner.manager.getRepository(ImportDetail);
            const supplierRepository = queryRunner.manager.getRepository(Supplier);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);
            const productRepository = queryRunner.manager.getRepository(Product);
            const userRepository = queryRunner.manager.getRepository(User);

            // First get the import record with required relations
            const importRecord = await importRepository
                .createQueryBuilder('import')
                .innerJoinAndSelect('import.user', 'user')  // Keep only the required inner joins
                .where('import.id = :id', { id })
                .setLock('pessimistic_write')
                .getOne();

            if (!importRecord) throw new NotFoundException(`Import with id ${id} not found! Please try again!`);

            // Then get the import details separately
            const oldImportDetails = await importDetailRepository
                .createQueryBuilder('importDetail')
                .innerJoinAndSelect('importDetail.product', 'product')
                .innerJoinAndSelect('importDetail.warehouse', 'warehouse')
                .where('importDetail.importRecord.id = :id', { id })
                .getMany();

            importRecord.importDetails = oldImportDetails;
        
            const importSupplier = await importRepository.findOne({ where: { id, tenant: { id: tenantId } }, relations: ['supplier'] });
            importRecord.supplier = importSupplier!.supplier;
                      
            oldImportRecord = importRecord;

            for (const importDetail of importRecord.importDetails) {
                // const productWarehouse = await warehouseDetailRepository.findOne({ where: { productId: importDetail.product.id, warehouseId: importDetail.warehouse.id }, relations: ['product', 'warehouse'] });
                const productWarehouse = await warehouseDetailRepository
                    .createQueryBuilder('warehouseDetail')
                    .innerJoinAndSelect('warehouseDetail.product', 'product')
                    .innerJoinAndSelect('warehouseDetail.warehouse', 'warehouse')
                    .where('warehouseDetail.productId = :productId', { productId: importDetail.product.id })
                    .andWhere('warehouseDetail.warehouseId = :warehouseId', { warehouseId: importDetail.warehouse.id })
                    .setLock('pessimistic_write')
                    .getOne();

                if (productWarehouse) {
                    productWarehouse.quantity -= importDetail.quantity;
                    await warehouseDetailRepository.save(productWarehouse);

                    oldWarehouseDetails.push(productWarehouse);

                    const lockedProduct = await productRepository.findOne({
                        where: { id: productWarehouse.product.id },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (!lockedProduct) throw new NotFoundException('Product not found! Please try again!');

                    lockedProduct.currentStock -= importDetail.quantity;
                    await productRepository.save(lockedProduct);
                }
            }

            await importDetailRepository.delete({ importRecord: { id } });

            for (const newImportDetail of updateData.importDetails) {
                // const productWarehouse = await warehouseDetailRepository.findOne({ where: { productId: newImportDetail.productId, warehouseId: newImportDetail.warehouseId }, relations: ['product', 'warehouse'] });
                const productWarehouse = await warehouseDetailRepository
                    .createQueryBuilder('warehouseDetail')
                    .innerJoinAndSelect('warehouseDetail.product', 'product')
                    .innerJoinAndSelect('warehouseDetail.warehouse', 'warehouse')
                    .where('warehouseDetail.productId = :productId', { productId: newImportDetail.productId })
                    .andWhere('warehouseDetail.warehouseId = :warehouseId', { warehouseId: newImportDetail.warehouseId })
                    .setLock('pessimistic_write')
                    .getOne();

                if (productWarehouse) {
                    productWarehouse.quantity += newImportDetail.quantity;
                    await warehouseDetailRepository.save(productWarehouse);

                    const lockedProduct = await productRepository.findOne({ 
                        where: { id: productWarehouse.product.id },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (!lockedProduct) throw new NotFoundException('Product not found! Please try again!');

                    lockedProduct.currentStock += newImportDetail.quantity;
                    await queryRunner.manager.save(lockedProduct);

                    newWarehouseDetails.push(productWarehouse);
                } else {
                    const products = await productRepository.findOne({ where: { id: newImportDetail.productId }, lock: { mode: 'pessimistic_write' } });
                    if (!products) throw new NotFoundException(`Product with id ${newImportDetail.productId} not found! Please try again!`);

                    const newWarehouseDetail = warehouseDetailRepository.create({
                        product: { id: newImportDetail.productId },
                        warehouse: { id: newImportDetail.warehouseId },
                        quantity: newImportDetail.quantity,
                        tenant: { id: tenantId }
                    });
                    await warehouseDetailRepository.save(newWarehouseDetail);
                    
                    products.currentStock += newImportDetail.quantity;
                    await productRepository.save(products);
                }

                const savedImportDetail = importDetailRepository.create({
                    quantity: newImportDetail.quantity,
                    importPrice: newImportDetail.importPrice,
                    product: { id: newImportDetail.productId },
                    warehouse: { id: newImportDetail.warehouseId },
                    importRecord: importRecord,
                    tenant: { id: tenantId }
                });

                await importDetailRepository.save(savedImportDetail);
            }

            const { importDetails, supplierId, userId, ...rest } = updateData;
            const supplier = updateData.supplierId ? await supplierRepository.findOne({ where: { id: updateData.supplierId } }) : null;
            const user = await userRepository.findOne({ where: { id: updateData.userId } });
            await importRepository.update(id, {
                ...rest,
                supplier: supplier,
                user: user!,
            });

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        const updatedImportRecord = await this.importRepository.findOne({
            where: { id },
            relations: ['importDetails', 'importDetails.product', 'importDetails.warehouse', 'supplier', 'user', 'tenant'],
        });

        this.mailService.sendUpdateImportEmail(oldImportRecord, updatedImportRecord!);
        this.utilService.alertMinimumStock(oldWarehouseDetails);
        this.utilService.alertMinimumStock(newWarehouseDetails);
    }

    async deleteImportRecord(id: string) {
        const warehouseDetails: WarehouseDetail[] = [];

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const importRepository = queryRunner.manager.getRepository(ImportRecord);
            const importDetailRepository = queryRunner.manager.getRepository(ImportDetail);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);

            const importRecord = await importRepository.findOne({ where: { id }, relations: ['importDetails', 'importDetails.product', 'importDetails.warehouse'] });
            if (!importRecord) throw new NotFoundException(`Import with id ${id} not found! Please try again!`);

            for (const importDetail of importRecord.importDetails) {
                const productWarehouse = await warehouseDetailRepository.findOne({ where: { productId: importDetail.product.id, warehouseId: importDetail.warehouse.id }, relations: ['product', 'warehouse'] });
                if (productWarehouse) {
                    productWarehouse.quantity -= importDetail.quantity;
                    await warehouseDetailRepository.save(productWarehouse);

                    productWarehouse.product.currentStock -= importDetail.quantity;
                    await queryRunner.manager.save(productWarehouse.product);

                    warehouseDetails.push(productWarehouse);
                }
            }

            await importDetailRepository.delete({ importRecord: { id } });
            await importRepository.delete(id);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        this.utilService.alertMinimumStock(warehouseDetails);
    }
}
