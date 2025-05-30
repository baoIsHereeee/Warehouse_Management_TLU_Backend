import { BadRequestException, Injectable } from '@nestjs/common';
import SupplierRepository from '../repositories/customer.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Supplier } from '../entities/supplier.entity';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos';
import { Not } from 'typeorm';

@Injectable()
export class SupplierService {
    constructor(
        private supplierRepository: SupplierRepository
    ){}

   
    async getAllSuppliers(options: IPaginationOptions, tenantId: string, query?: string): Promise<Pagination<Supplier>> {
        const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');

        queryBuilder.where('supplier.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.where('LOWER(supplier.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Supplier>(queryBuilder, options);
    }

    async getSupplierById(id: string) {
        return this.supplierRepository.findOne({ where: { id }, relations: ['importRecords'] });
    }

    async getSupplierList(tenantId: string) {
        return this.supplierRepository.find({ where: { tenant: { id: tenantId } } });
    }

    async createSupplier(createData: CreateSupplierDTO, tenantId: string) {
        const existingEmail = await this.supplierRepository.findOne({ where: { email: createData.email, tenant: { id: tenantId } } });
        if (existingEmail) throw new BadRequestException('Supplier with this email already exists');

        const newSupplier = this.supplierRepository.create({ ...createData, tenant: { id: tenantId } });
        return await this.supplierRepository.save(newSupplier);
    }

    async updateSupplier(id: string, updateData: UpdateSupplierDTO, tenantId: string) {
        const existingSupplier = await this.supplierRepository.findOne({ where: { id, tenant: { id: tenantId } } });
        if (!existingSupplier) throw new BadRequestException('Supplier not found! Please try again!');

        const existingEmail = await this.supplierRepository.findOne({ where: { email: updateData.email, id: Not(id), tenant: { id: tenantId } } });
        if (existingEmail) throw new BadRequestException('Supplier with this email already exists');
    
        return await this.supplierRepository.update(id, updateData);
    }

    async deleteSupplier(id: string) {
        const existingSupplier = await this.supplierRepository.findOne({ where: { id } });
        if (!existingSupplier) throw new BadRequestException('Supplier not found! Please try again!');

        existingSupplier.email = null;
        await this.supplierRepository.save(existingSupplier);

        return await this.supplierRepository.softDelete(id);
    }
}
