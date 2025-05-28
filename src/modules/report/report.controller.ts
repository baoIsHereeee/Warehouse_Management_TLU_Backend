import { Controller, Get } from '@nestjs/common';
import { ReportService } from './services/report.service';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('total-number-of-inventory')
    async getTotalNumberOfInventory() {
        return await this.reportService.getTotalNumberOfInventory();
    }

    @Get('total-value-of-inventory')
    async getTotalValueOfInventory() {
        return await this.reportService.getTotalValueOfInventory();
    }

    @Get('total-value-of-imports')
    async getTotalValueOfImports() {
        return await this.reportService.getTotalValueOfImports();
    }

    @Get('total-value-of-exports')
    async getTotalValueOfExports() {
        return await this.reportService.getTotalValueOfExports();
    }

    @Get('inventory-value-per-warehouse')
    async getInventoryValuePerWarehouse() {
        return await this.reportService.getInventoryValuePerWarehouse();
    }

    @Get('total-inventory-per-warehouse')
    async getTotalInventoryPerWarehouse() {
        return await this.reportService.getTotalInventoryPerWarehouse();
    }

    @Get('low-stock-products')
    async getLowStockProducts() {
        return await this.reportService.getLowStockProducts();
    }

    @Get('inventory-distribution-by-category')
    async getInventoryDistributionByCategory() {
        return await this.reportService.getInventoryDistributionByCategory();
    }
    
}
