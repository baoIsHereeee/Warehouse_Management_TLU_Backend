import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ExportRecord } from '../../../modules/export-record/entities/export.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { ImportRecord } from '../../../modules/import-record/entities/import.entity';
import { WarehouseDetail } from '../../../modules/warehouse/entities/warehouse-detail.entity';

@Injectable()
export class MailService {
    private adminEmails : string[] = [];

    constructor(
        private mailerService: MailerService,

        private userRepository: UserRepository,
    ) {}

    async onModuleInit() {
        const admins = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .where('role.name = :roleName', { roleName: 'Admin' })
            .select(['user.email'])
            .getMany();

            this.adminEmails = admins
            .map(admin => admin.email)
            .filter((email): email is string => email !== null && email !== undefined);
    }

    async sendCreateProductEmail(product: Product) {
        try {
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
            await this.mailerService.sendMail({
                to: this.adminEmails,
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
}
