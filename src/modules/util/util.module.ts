import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { UtilService } from './services/util.service';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
    imports: [MailModule, WarehouseModule, SupplierModule],
    providers: [UtilService],
    exports: [UtilService]
})
export class UtilModule {}
