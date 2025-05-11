import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ImportRecordModule } from './modules/import_record/import_record.module';
import { ExportRecordService } from './modules/export_record/export_record.service';
import { ExportRecordModule } from './modules/export_record/export_record.module';
import { CustomerController } from './modules/customer/customer.controller';
import { CustomerService } from './modules/customer/customer.service';
import { CustomerModule } from './modules/customer/customer.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { WarehouseService } from './modules/warehouse/warehouse.service';
import { WarehouseController } from './modules/warehouse/warehouse.controller';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [UserModule, RoleModule, PermissionModule, CategoryModule, ProductModule, ImportRecordModule, ExportRecordModule, CustomerModule, SupplierModule, WarehouseModule, ReportModule],
  controllers: [AppController, CustomerController, WarehouseController],
  providers: [AppService, ExportRecordService, CustomerService, WarehouseService],
})
export class AppModule {}
