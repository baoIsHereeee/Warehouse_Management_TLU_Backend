import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './services/report.service';
import { ProductModule } from '../product/product.module';
import { ImportRecordModule } from '../import-record/import-record.module';
import { ExportRecordModule } from '../export-record/export-record.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [ProductModule, ImportRecordModule, ExportRecordModule, WarehouseModule, JwtModule, PermissionModule]
})
export class ReportModule {}
