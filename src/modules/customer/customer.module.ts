import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import CustomerRepository from './repositories/customer.repository';
import { CustomerController } from './customer.controller';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
    providers: [CustomerService, CustomerRepository],
    exports: [CustomerRepository],
    controllers: [CustomerController],
    imports: [JwtModule, PermissionModule]
})
export class CustomerModule {}
