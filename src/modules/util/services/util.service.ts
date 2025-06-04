import { Injectable } from '@nestjs/common';
import { MailService } from '../../../modules/mail/services/mail.service';
import { WarehouseDetail } from '../../../modules/warehouse/entities/warehouse-detail.entity';
import SupplierRepository from '../../../modules/supplier/repositories/customer.repository';
import WarehouseDetailRepository from '../../../modules/warehouse/repositories/warehouse-detail.repository';

@Injectable()
export class UtilService {
    constructor(
        private mailService: MailService,
        private supplierRepository: SupplierRepository,
        private warehouseDetailRepository: WarehouseDetailRepository
    ){}

    async alertMinimumStock(warehouseDetails: WarehouseDetail[]) {
        for (const warehouseDetail of warehouseDetails) {
            const warehouseDetailData = await this.warehouseDetailRepository.findOne({ where: { product: { id: warehouseDetail.product.id }, warehouse: { id: warehouseDetail.warehouse.id } }, relations: ['product', 'warehouse', 'tenant'] });
            if (warehouseDetail.product.minimumStock) {
                if (warehouseDetail.quantity <= warehouseDetail.product.minimumStock) {
                    this.mailService.alertMinimumStockEmail(warehouseDetailData!);
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
                            .getMany();
    
                        const supplierEmail: string[] = supplier?.map(supplier => supplier.email).filter((email): email is string => email !== null) ?? [];
    
                        if (supplierEmail) this.mailService.automationOrderEmail(supplierEmail, warehouseDetailData!);
                    }
                } catch (error) {
                    console.error('Error sending automation order email:', error);
                }
            }
        }
    }
}
