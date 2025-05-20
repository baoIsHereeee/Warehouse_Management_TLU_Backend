import { BadRequestException, Injectable } from '@nestjs/common';
import CustomerRepository from '../repositories/customer.repository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
    constructor(
        private customerRepository: CustomerRepository
    ){}

   
    async getAllCustomers(options: IPaginationOptions, query?: string): Promise<Pagination<Customer>> {
        const queryBuilder = this.customerRepository.createQueryBuilder('customer');

        if (query) queryBuilder.where('LOWER(customer.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Customer>(queryBuilder, options);
    }

    async getAllCustomerList(){
        return await this.customerRepository.find();
    }

    async getCustomerById(id: string) {
        return this.customerRepository.findOne({ where: { id }, relations: ['exportRecords'] });
    }

    async createCustomer(createData: CreateCustomerDTO) {
        const existingEmail = await this.customerRepository.findOne({ where: { email: createData.email } });
        if (existingEmail) throw new BadRequestException('Customer with this email already exists');

        const newCustomer = this.customerRepository.create(createData);
        return await this.customerRepository.save(newCustomer);
    }

    async updateCustomer(id: string, updateData: UpdateCustomerDTO) {
        const existingCustomer = await this.customerRepository.findOne({ where: { id } });
        if (!existingCustomer) throw new BadRequestException('Customer not found! Please try again!');

        const existingEmail = await this.customerRepository.findOne({ where: { email: updateData.email } });
        if (existingEmail && existingEmail.id !== id) throw new BadRequestException('Customer with this email already exists');
    
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
