import { BadRequestException, Injectable } from '@nestjs/common';
import SupplierRepository from '../repositories/customer.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Supplier } from '../entities/supplier.entity';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos';

@Injectable()
export class SupplierService {
    constructor(
        private supplierRepository: SupplierRepository
    ){}

   
    async getAllSuppliers(options: IPaginationOptions, query?: string): Promise<Pagination<Supplier>> {
        const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');

        if (query) queryBuilder.where('LOWER(supplier.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Supplier>(queryBuilder, options);
    }

    async getSupplierById(id: string) {
        return this.supplierRepository.findOne({ where: { id } });
    }

    async createSupplier(createData: CreateSupplierDTO) {
        const existingEmail = await this.supplierRepository.findOne({ where: { email: createData.email } });
        if (existingEmail) throw new BadRequestException('Supplier with this email already exists');

        const newSupplier = this.supplierRepository.create(createData);
        return await this.supplierRepository.save(newSupplier);
    }

    async updateSupplier(id: string, updateData: UpdateSupplierDTO) {
        const existingSupplier = await this.supplierRepository.findOne({ where: { id } });
        if (!existingSupplier) throw new BadRequestException('Supplier not found! Please try again!');

        const existingEmail = await this.supplierRepository.findOne({ where: { email: updateData.email } });
        if (existingEmail && existingEmail.id !== id) throw new BadRequestException('Supplier with this email already exists');
    
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
