import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import WarehouseRepository from '../repositories/warehouse.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDTO, CreateWarehouseTransferDTO, UpdateWarehouseDTO, UpdateWarehouseTransferDTO } from '../dtos';
import { DataSource, Not } from 'typeorm';
import { WarehouseDetail } from '../entities/warehouse-detail.entity';
import { WarehouseTransfer } from '../entities/warehouse-transfer.entity';
import WarehouseTransferRepository from '../repositories/warehouse-transfer.repository';
import { WarehouseTransferDetail } from '../entities/warehouse-transfer-detail.entity';

@Injectable()
export class WarehouseService {
    constructor(
        private warehouseRepository: WarehouseRepository,
        private dataSource: DataSource,
        private warehouseTransferRepository: WarehouseTransferRepository,
    ) {}


    async getAllWarehouses(options: IPaginationOptions, tenantId: string, query?: string): Promise<Pagination<Warehouse>> {
        const queryBuilder = this.warehouseRepository.createQueryBuilder('warehouse');

        queryBuilder.where('warehouse.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.andWhere('LOWER(warehouse.name) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Warehouse>(queryBuilder, options);
    }

    async getAllWarehouseList(tenantId: string){
        return await this.warehouseRepository.find({ where: { tenant: { id: tenantId } } });
    }

    async getWarehouseById(id: string) {
        return this.warehouseRepository.findOne({ where: { id }, relations: ['warehouseDetails', 'warehouseDetails.product'] });
    }

    async createWarehouse(createData: CreateWarehouseDTO, tenantId: string) {
        const newWarehouse = this.warehouseRepository.create({ ...createData, tenant: { id: tenantId } });
        return this.warehouseRepository.save(newWarehouse);
    }

    async updateWarehouse(id: string, updateData: UpdateWarehouseDTO, tenantId: string) {
        const warehouse = await this.warehouseRepository.findOne({ where: { id, tenant: { id: tenantId } } });
        if (!warehouse) throw new NotFoundException('Warehouse not found! Please try again!');

        return await this.warehouseRepository.update(id, updateData);
    }

    async deleteWarehouse(id: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const warehouseRepository = queryRunner.manager.getRepository(Warehouse);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);

            const warehouse = await warehouseRepository.findOne({ where: { id }, relations: ['warehouseDetails'] });
            if (!warehouse) throw new NotFoundException('Warehouse not found');

            if (warehouse.warehouseDetails.length > 0) throw new BadRequestException('This Warehouse has already been used! Cannot delete warehouse!');

            await warehouseDetailRepository.delete({ warehouseId: id });
            await warehouseRepository.softDelete(id);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getAllWarehouseTransfers(options: IPaginationOptions, tenantId: string, query?: string) {
        const queryBuilder = this.warehouseTransferRepository.createQueryBuilder('warehouseTransfer');

        queryBuilder.where('warehouseTransfer.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.andWhere('LOWER(warehouseTransfer.description) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<WarehouseTransfer>(queryBuilder, options);
    }

    async getWarehouseTransferById(id: string) {
        return this.warehouseTransferRepository.findOne({ where: { id }, relations: ['warehouseTransferDetails', 'fromWarehouse', 'toWarehouse', 'warehouseTransferDetails.product'] });
    }

    async createWarehouseTransfer(createData: CreateWarehouseTransferDTO, tenantId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const warehouseTransferRepository = queryRunner.manager.getRepository(WarehouseTransfer);
            const warehouseTransferDetailRepository = queryRunner.manager.getRepository(WarehouseTransferDetail);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);

            const newWarehouseTransfer = warehouseTransferRepository.create({
                user: { id: createData.userId},
                description: createData.description,
                fromWarehouse: { id: createData.fromWarehouseId },
                toWarehouse: { id: createData.toWarehouseId },
                tenant: { id: tenantId }
            });

            const savedWarehouseTransfer = await warehouseTransferRepository.save(newWarehouseTransfer);

            for (const warehouseTransferDetail of createData.warehouseTransferDetails){
                const outgoingWarehouseDetail = await warehouseDetailRepository.findOne({ where: { warehouse: { id: createData.fromWarehouseId }, product: { id: warehouseTransferDetail.productId } }, relations: ['product'] });
                if (!outgoingWarehouseDetail) throw new NotFoundException(`Product not found in outgoing warehouse! Cannot create warehouse transfer!`);
                
                if (warehouseTransferDetail.quantity > outgoingWarehouseDetail.quantity) throw new BadRequestException(`Transfer quantity for product ${outgoingWarehouseDetail.product.name} (${warehouseTransferDetail.quantity}) exceeds current quantity in outgoing warehouse (${outgoingWarehouseDetail.quantity})`);

                outgoingWarehouseDetail.quantity -= warehouseTransferDetail.quantity;
                await warehouseDetailRepository.save(outgoingWarehouseDetail);

                const incomingWarehouseDetail = await warehouseDetailRepository.findOneBy({ warehouse: { id: createData.toWarehouseId }, product: { id: warehouseTransferDetail.productId } });
                if (incomingWarehouseDetail){
                    incomingWarehouseDetail.quantity += warehouseTransferDetail.quantity;
                    await warehouseDetailRepository.save(incomingWarehouseDetail);
                } else {
                    const newIncomingWarehouseDetail = warehouseDetailRepository.create({
                        warehouse: { id: createData.toWarehouseId },
                        product: { id: warehouseTransferDetail.productId },
                        quantity: warehouseTransferDetail.quantity,
                        tenant: { id: tenantId }
                    });
                    await warehouseDetailRepository.save(newIncomingWarehouseDetail);
                }

                const newWarehouseTransferDetail = warehouseTransferDetailRepository.create({
                    warehouseTransfer: savedWarehouseTransfer,
                    product: { id: warehouseTransferDetail.productId },
                    quantity: warehouseTransferDetail.quantity,
                    tenant: { id: tenantId }
                });

                await warehouseTransferDetailRepository.save(newWarehouseTransferDetail);
            }
            
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateWarehouseTransfer(id: string, updateData: UpdateWarehouseTransferDTO, tenantId: string) {
        const warehouseTransfer = await this.warehouseTransferRepository.findOne({ where: { id }, relations: ['warehouseTransferDetails', 'fromWarehouse', 'toWarehouse', 'warehouseTransferDetails.product'] });
        if (!warehouseTransfer) throw new NotFoundException('Warehouse transfer not found! Please try again!');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const warehouseTransferRepository = queryRunner.manager.getRepository(WarehouseTransfer);
            const warehouseTransferDetailRepository = queryRunner.manager.getRepository(WarehouseTransferDetail);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);

            for (const warehouseTransferDetail of warehouseTransfer.warehouseTransferDetails){
                const outgoingWarehouseDetail = await warehouseDetailRepository.findOne({ where: { warehouse: { id: warehouseTransfer.fromWarehouse.id }, product: { id: warehouseTransferDetail.product.id } } });

                outgoingWarehouseDetail!.quantity += warehouseTransferDetail.quantity;
                await warehouseDetailRepository.save(outgoingWarehouseDetail!);
                
                const incomingWarehouseDetail = await warehouseDetailRepository.findOneBy({ warehouse: { id: warehouseTransfer.toWarehouse.id }, product: { id: warehouseTransferDetail.product.id } });

                incomingWarehouseDetail!.quantity -= warehouseTransferDetail.quantity;
                await warehouseDetailRepository.save(incomingWarehouseDetail!);

                await warehouseTransferDetailRepository.delete(warehouseTransferDetail);
            }

            for (const warehouseTransferDetail of updateData.warehouseTransferDetails){
                const outgoingWarehouseDetail = await warehouseDetailRepository.findOne({ where: { warehouse: { id: updateData.fromWarehouseId }, product: { id: warehouseTransferDetail.productId } }, relations: ['product'] });
                if (!outgoingWarehouseDetail) throw new NotFoundException('Product not found in outgoing warehouse! Cannot create warehouse transfer!');
                
                if (warehouseTransferDetail.quantity > outgoingWarehouseDetail.quantity) throw new BadRequestException(`Transfer quantity for product ${outgoingWarehouseDetail.product.name} (${warehouseTransferDetail.quantity}) exceeds current quantity in outgoing warehouse (${outgoingWarehouseDetail.quantity})`);

                outgoingWarehouseDetail.quantity -= warehouseTransferDetail.quantity;
                await warehouseDetailRepository.save(outgoingWarehouseDetail);

                const incomingWarehouseDetail = await warehouseDetailRepository.findOneBy({ warehouse: { id: updateData.toWarehouseId }, product: { id: warehouseTransferDetail.productId } });
                if (incomingWarehouseDetail){
                    incomingWarehouseDetail.quantity += warehouseTransferDetail.quantity;
                    await warehouseDetailRepository.save(incomingWarehouseDetail);
                } else {
                    const newIncomingWarehouseDetail = warehouseDetailRepository.create({
                        warehouse: { id: updateData.toWarehouseId },
                        product: { id: warehouseTransferDetail.productId },
                        quantity: warehouseTransferDetail.quantity,
                        tenant: { id: tenantId }
                    });
                    await warehouseDetailRepository.save(newIncomingWarehouseDetail);
                }

                const newWarehouseTransferDetail = warehouseTransferDetailRepository.create({
                    warehouseTransfer: warehouseTransfer,
                    product: { id: warehouseTransferDetail.productId },
                    quantity: warehouseTransferDetail.quantity,
                    tenant: { id: tenantId }
                });

                await warehouseTransferDetailRepository.save(newWarehouseTransferDetail);
            }   

            await warehouseTransferRepository.update(id, { 
                user: { id: updateData.userId },
                description: updateData.description, 
                fromWarehouse: { id: updateData.fromWarehouseId }, 
                toWarehouse: { id: updateData.toWarehouseId } 
            });

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteWarehouseTransfer(id: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const warehouseTransferRepository = queryRunner.manager.getRepository(WarehouseTransfer);
            const warehouseTransferDetailRepository = queryRunner.manager.getRepository(WarehouseTransferDetail);
            const warehouseDetailRepository = queryRunner.manager.getRepository(WarehouseDetail);

            const warehouseTransfer = await warehouseTransferRepository.findOne({ where: { id }, relations: ['warehouseTransferDetails', 'fromWarehouse', 'toWarehouse', 'warehouseTransferDetails.product'] });
            if (!warehouseTransfer) throw new NotFoundException('Warehouse transfer not found! Please try again!');

            for (const warehouseTransferDetail of warehouseTransfer.warehouseTransferDetails){
                const outgoingWarehouseDetail = await warehouseDetailRepository.findOne({ where: { warehouse: { id: warehouseTransfer.fromWarehouse.id }, product: { id: warehouseTransferDetail.product.id } } });

                outgoingWarehouseDetail!.quantity += warehouseTransferDetail.quantity;
                await warehouseDetailRepository.save(outgoingWarehouseDetail!);

                const incomingWarehouseDetail = await warehouseDetailRepository.findOneBy({ warehouse: { id: warehouseTransfer.toWarehouse.id }, product: { id: warehouseTransferDetail.product.id } });

                incomingWarehouseDetail!.quantity -= warehouseTransferDetail.quantity;
                await warehouseDetailRepository.save(incomingWarehouseDetail!);

                await warehouseTransferDetailRepository.delete(warehouseTransferDetail);
            }

            await warehouseTransferRepository.delete(id);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
