import { Module } from '@nestjs/common';
import WarehouseRepository from './repositories/warehouse.repository';
import WarehouseDetailRepository from './repositories/warehouse-detail.repository';
import { WarehouseService } from './services/warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
    providers: [WarehouseRepository, WarehouseDetailRepository, WarehouseService],
    exports: [WarehouseRepository, WarehouseDetailRepository],
    controllers: [WarehouseController],
    imports: [JwtModule, PermissionModule]
})
export class WarehouseModule {}
