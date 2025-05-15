import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { UtilService } from './services/util.service';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
    imports: [MailModule, WarehouseModule],
    providers: [UtilService],
    exports: [UtilService]
})
export class UtilModule {}
