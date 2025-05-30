import { BadRequestException, Injectable } from '@nestjs/common';
import CustomerRepository from '../repositories/customer.repository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Customer } from '../entities/customer.entity';
import { Not } from 'typeorm';

@Injectable()
export class CustomerService {
    constructor(
        private customerRepository: CustomerRepository
    ){}

    async getAllCustomers(options: IPaginationOptions, tenantId: string, query?: string): Promise<Pagination<Customer>> {
        const queryBuilder = this.customerRepository.createQueryBuilder('customer');

        queryBuilder.where('customer.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.andWhere('LOWER(customer.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Customer>(queryBuilder, options);
    }

    async getAllCustomerList(tenantId: string){
        return await this.customerRepository.find({ where: { tenant: { id: tenantId } } });
    }

    async getCustomerById(id: string) {
        return this.customerRepository.findOne({ where: { id }, relations: ['exportRecords'] });
    }

    async createCustomer(createData: CreateCustomerDTO, tenantId: string) {
        const existingEmail = await this.customerRepository.findOne({ where: { email: createData.email, tenant: { id: tenantId } } });
        if (existingEmail) throw new BadRequestException('Customer with this email already exists');

        const newCustomer = this.customerRepository.create({ ...createData, tenant: { id: tenantId } });
        return await this.customerRepository.save(newCustomer);
    }

    async updateCustomer(id: string, updateData: UpdateCustomerDTO, tenantId: string) {
        const existingCustomer = await this.customerRepository.findOne({ where: { id, tenant: { id: tenantId } } });
        if (!existingCustomer) throw new BadRequestException('Customer not found! Please try again!');

        const existingEmail = await this.customerRepository.findOne({ where: { email: updateData.email, id: Not(id), tenant: { id: tenantId } } });
        if (existingEmail) throw new BadRequestException('Customer with this email already exists');
    
        return await this.customerRepository.update(id, updateData);
    }

    async deleteCustomer(id: string) {
        const existingCustomer = await this.customerRepository.findOne({ where: { id } });
        if (!existingCustomer) throw new BadRequestException('Customer not found! Please try again!');

        existingCustomer.email = null;
        await this.customerRepository.save(existingCustomer);

        return await this.customerRepository.softDelete(id);
    }
}
