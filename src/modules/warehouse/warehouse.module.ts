import { Module } from '@nestjs/common';
import WarehouseRepository from './repositories/warehouse.repository';
import WarehouseDetailRepository from './repositories/warehouse-detail.repository';
import { WarehouseService } from './services/warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import WarehouseTransferDetailRepository from './repositories/warehouse-transfer-detail.repository';
import WarehouseTransferRepository from './repositories/warehouse-transfer.repository';
import { UserModule } from '../user/user.module';

@Module({
    providers: [WarehouseRepository, WarehouseDetailRepository, WarehouseService, WarehouseTransferRepository, WarehouseTransferDetailRepository],
    exports: [WarehouseRepository, WarehouseDetailRepository, WarehouseTransferRepository, WarehouseTransferDetailRepository],
    controllers: [WarehouseController],
    imports: [JwtModule, PermissionModule, UserModule]
})
export class WarehouseModule {}
