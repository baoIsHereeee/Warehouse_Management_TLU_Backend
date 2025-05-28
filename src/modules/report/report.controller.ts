import { Controller, Get } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { Auth } from '../../decorators/permission.decorator';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('total-number-of-inventory')
    @Auth('get_total_number_of_inventory')
    async getTotalNumberOfInventory() {
        return await this.reportService.getTotalNumberOfInventory();
    }

    @Get('total-value-of-inventory')
    @Auth('get_total_value_of_inventory')
    async getTotalValueOfInventory() {
        return await this.reportService.getTotalValueOfInventory();
    }

    @Get('total-value-of-imports')
    @Auth('get_total_value_of_imports')
    async getTotalValueOfImports() {
        return await this.reportService.getTotalValueOfImports();
    }

    @Get('total-value-of-exports')
    @Auth('get_total_value_of_exports')
    async getTotalValueOfExports() {
        return await this.reportService.getTotalValueOfExports();
    }

    @Get('inventory-value-per-warehouse')
    @Auth('get_inventory_value_per_warehouse')
    async getInventoryValuePerWarehouse() {
        return await this.reportService.getInventoryValuePerWarehouse();
    }

    @Get('total-inventory-per-warehouse')
    @Auth('get_total_inventory_per_warehouse')
    async getTotalInventoryPerWarehouse() {
        return await this.reportService.getTotalInventoryPerWarehouse();
    }

    @Get('low-stock-products')
    @Auth('get_low_stock_products')
    async getLowStockProducts() {
        return await this.reportService.getLowStockProducts();
    }

    @Get('inventory-distribution-by-category')
    @Auth('get_inventory_distribution_by_category')
    async getInventoryDistributionByCategory() {
        return await this.reportService.getInventoryDistributionByCategory();
    }
    
}
