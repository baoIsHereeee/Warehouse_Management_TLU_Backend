import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ImportRecordModule } from './modules/import-record/import-record.module';
import { ExportRecordModule } from './modules/export-record/export-record.module';
import { CustomerModule } from './modules/customer/customer.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { ReportModule } from './modules/report/report.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from './modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedsModule } from './databases/seeds/seeds.module';
import * as path from "path";
import typeorm from './databases/typeorm';

@Module({
  imports: [UserModule, RoleModule, PermissionModule, CategoryModule, ProductModule, ImportRecordModule, ExportRecordModule, CustomerModule, SupplierModule, WarehouseModule, ReportModule, JwtModule, AuthModule, SeedsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm') as TypeOrmModuleOptions)
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './configs/.env'),
      load: [typeorm]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
