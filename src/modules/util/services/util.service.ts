import { Injectable } from '@nestjs/common';
import { MailService } from '../../../modules/mail/services/mail.service';
import { WarehouseDetail } from '../../../modules/warehouse/entities/warehouse-detail.entity';

@Injectable()
export class UtilService {
    constructor(
        private mailService: MailService,
    ){}

    async alertMinimumStock(warehouseDetails: WarehouseDetail[]) {
        for (const warehouseDetail of warehouseDetails) {
            if (warehouseDetail.product.minimumStock) {
                if (warehouseDetail.quantity <= warehouseDetail.product.minimumStock) {
                    this.mailService.alertMinimumStockEmail(warehouseDetail);
                }
            }
        }
    }
}
