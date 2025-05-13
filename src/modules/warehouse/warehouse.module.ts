import { Module } from '@nestjs/common';
import WarehouseRepository from './repositories/warehouse.repository';
import WarehouseDetailRepository from './repositories/warehouse-detail.repository';
import { WarehouseService } from './services/warehouse.service';

@Module({
    providers: [WarehouseRepository, WarehouseDetailRepository, WarehouseService],
    exports: [WarehouseRepository, WarehouseDetailRepository],
})
export class WarehouseModule {}
