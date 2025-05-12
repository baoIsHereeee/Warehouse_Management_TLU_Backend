import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import CustomerRepository from './repositories/customer.repository';

@Module({
    providers: [CustomerService, CustomerRepository],
    exports: [CustomerRepository]
})
export class CustomerModule {}
