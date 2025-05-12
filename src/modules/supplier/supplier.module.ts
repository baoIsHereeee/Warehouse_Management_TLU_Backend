import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './services/supplier.service';
import SupplierRepository from './repositories/customer.repository';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepository]
})
export class SupplierModule {}
