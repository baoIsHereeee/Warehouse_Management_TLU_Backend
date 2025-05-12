import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import CustomerRepository from './repositories/customer.repository';
import { CustomerController } from './customer.controller';

@Module({
    providers: [CustomerService, CustomerRepository],
    exports: [CustomerRepository],
    controllers: [CustomerController]
})
export class CustomerModule {}
