import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ExportRecord } from '../../../modules/export-record/entities/export.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { ImportRecord } from '../../../modules/import-record/entities/import.entity';
import { WarehouseDetail } from '../../../modules/warehouse/entities/warehouse-detail.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private userRepository: UserRepository
    ) {}

    private async getAdminEmailsByTenant(tenantId: string): Promise<string[]> {
        const admins = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoles', 'userRole')
            .leftJoinAndSelect('userRole.role', 'role')
            .where('role.name = :roleName', { roleName: 'Admin' })
            .andWhere('user.tenant.id = :tenantId', { tenantId })
            .select(['user.email'])
            .getMany();

        return admins
            .map(admin => admin.email)
            .filter((email): email is string => email !== null && email !== undefined);
    }

    async sendCreateProductEmail(product: Product) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(product.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Product Created',
                template: 'product/create-product.template.hbs', 
                context: {
                    productData: product,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async sendUpdateProductEmail(oldProduct: Product, newProduct: Product) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(newProduct.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Product Updated',
                template: 'product/update-product.template.hbs', 
                context: {
                    oldProductData: oldProduct,
                    newProductData: newProduct,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async sendCreateExportEmail(exportRecord: ExportRecord) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(exportRecord.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Export Created',
                template: 'export-record/create-export.template.hbs', 
                context: {
                    exportData: exportRecord,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async sendUpdateExportEmail(oldExport: ExportRecord, newExport: ExportRecord) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(newExport.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Export Updated',
                template: 'export-record/update-export.template.hbs', 
                context: {
                    oldExportData: oldExport,
                    newExportData: newExport,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async sendCreateImportEmail(importRecord: ImportRecord) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(importRecord.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Import Created',
                template: 'import-record/create-import.template.hbs', 
                context: {
                    importData: importRecord,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async sendUpdateImportEmail(oldImport: ImportRecord, newImport: ImportRecord) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(newImport.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Import Updated',
                template: 'import-record/update-import.template.hbs', 
                context: {
                    oldImportData: oldImport,
                    newImportData: newImport,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async alertMinimumStockEmail(warehouseDetail: WarehouseDetail){
        try {
            const adminEmails = await this.getAdminEmailsByTenant(warehouseDetail.tenant.id);
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: `Alert: Product ${warehouseDetail.product.name} in Warehouse ${warehouseDetail.warehouse.name} is below minimum stock level`,
                template: 'product/minimum-stock.template.hbs', 
                context: {
                    warehouseDetailData: warehouseDetail
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async automationOrderEmail(supplierEmail: string[], warehouseDetail: WarehouseDetail) {
        try {
            const adminEmails = await this.getAdminEmailsByTenant(warehouseDetail.tenant.id);
            await this.mailerService.sendMail({
                to: [...supplierEmail, ...adminEmails], 
                subject: `📤 Automation Order for Product ${warehouseDetail.product.name} 📤`,
                template: 'product/automation-order.template.hbs', 
                context: {
                    warehouseDetailData: warehouseDetail
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
