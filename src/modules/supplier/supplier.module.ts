import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './services/supplier.service';
import SupplierRepository from './repositories/customer.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepository],
  exports: [SupplierRepository],
  imports: [JwtModule, PermissionModule]
})
export class SupplierModule {}
