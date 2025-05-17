import { Injectable } from '@nestjs/common';
import { MailService } from '../../../modules/mail/services/mail.service';
import { WarehouseDetail } from '../../../modules/warehouse/entities/warehouse-detail.entity';
import SupplierRepository from '../../../modules/supplier/repositories/customer.repository';

@Injectable()
export class UtilService {
    constructor(
        private mailService: MailService,
        private supplierRepository: SupplierRepository
    ){}

    async alertMinimumStock(warehouseDetails: WarehouseDetail[]) {
        for (const warehouseDetail of warehouseDetails) {
            if (warehouseDetail.product.minimumStock) {
                if (warehouseDetail.quantity <= warehouseDetail.product.minimumStock) {
                    this.mailService.alertMinimumStockEmail(warehouseDetail);
                }

                try {
                    if (warehouseDetail.product.orderStock) {
                        const supplier = await this.supplierRepository
                            .createQueryBuilder('supplier')
                            .distinct(true)
                            .select(['supplier.email'])
                            .innerJoin('supplier.importRecords', 'import') 
                            .innerJoin('import.importDetails', 'importDetail') 
                            .innerJoin('importDetail.product', 'product')
                            .where('product.id = :productId', { productId: warehouseDetail.product.id })
                            .getOne();
    
                        const supplierEmail: string | null = supplier?.email ?? null;
    
                        if (supplierEmail) this.mailService.automationOrderEmail(supplierEmail, warehouseDetail);
                    }
                } catch (error) {
                    console.error('Error sending automation order email:', error);
                }
            }
        }
    }
}
