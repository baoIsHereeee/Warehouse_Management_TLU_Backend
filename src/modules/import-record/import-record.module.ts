import { Module } from '@nestjs/common';
import { ImportRecordController } from './import-record.controller';
import { ImportRecordService } from './services/import-record.service';
import ImportRepository from './repositories/import.repository';
import ImportDetailRepository from './repositories/import-detail.repository';
import { SupplierModule } from '../supplier/supplier.module';
import { UserModule } from '../user/user.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ProductModule } from '../product/product.module';
import { MailModule } from '../mail/mail.module';
import { UtilModule } from '../util/util.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [ImportRecordController],
  providers: [ImportRecordService, ImportRepository, ImportDetailRepository],
  exports: [ImportRepository, ImportDetailRepository],
  imports: [SupplierModule, UserModule, WarehouseModule, ProductModule, MailModule, UtilModule, JwtModule, PermissionModule]
})
export class ImportRecordModule {}
