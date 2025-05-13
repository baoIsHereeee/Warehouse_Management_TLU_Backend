import { Module } from '@nestjs/common';
import { ExportRecordController } from './export-record.controller';
import { ExportService } from './services/export-record.service';
import ExportRepository from './repositories/export.repository';
import ExportDetailRepository from './repositories/export-detail.repository';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [ExportRecordController],
  providers: [ExportRepository, ExportDetailRepository, ExportService],
  imports: [UserModule, CustomerModule, WarehouseModule, ProductModule]
})
export class ExportRecordModule {}
