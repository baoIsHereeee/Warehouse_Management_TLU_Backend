import { Module } from '@nestjs/common';
import { ExportRecordController } from './export-record.controller';
import { ExportService } from './services/export-record.service';
import ExportRepository from './repositories/export.repository';
import ExportDetailRepository from './repositories/export-detail.repository';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ProductModule } from '../product/product.module';
import { MailModule } from '../mail/mail.module';
import { UtilModule } from '../util/util.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [ExportRecordController],
  providers: [ExportRepository, ExportDetailRepository, ExportService],
  exports: [ExportRepository, ExportDetailRepository],
  imports: [UserModule, CustomerModule, WarehouseModule, ProductModule, MailModule, UtilModule, JwtModule, PermissionModule]
})
export class ExportRecordModule {}
