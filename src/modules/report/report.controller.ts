import { Controller, Get } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('total-number-of-inventory')
    @Auth('get_total_number_of_inventory')
    async getTotalNumberOfInventory(@CurrentTenant() tenantId: string) {
        return await this.reportService.getTotalNumberOfInventory(tenantId);
    }

    @Get('total-value-of-inventory')
    @Auth('get_total_value_of_inventory')
    async getTotalValueOfInventory(@CurrentTenant() tenantId: string) {
        return await this.reportService.getTotalValueOfInventory(tenantId);
    }

    @Get('total-value-of-imports')
    @Auth('get_total_value_of_imports')
    async getTotalValueOfImports(@CurrentTenant() tenantId: string) {
        return await this.reportService.getTotalValueOfImports(tenantId);
    }

    @Get('total-value-of-exports')
    @Auth('get_total_value_of_exports')
    async getTotalValueOfExports(@CurrentTenant() tenantId: string) {
        return await this.reportService.getTotalValueOfExports(tenantId);
    }

    @Get('inventory-value-per-warehouse')
    @Auth('get_inventory_value_per_warehouse')
    async getInventoryValuePerWarehouse(@CurrentTenant() tenantId: string) {
        return await this.reportService.getInventoryValuePerWarehouse(tenantId);
    }

    @Get('total-inventory-per-warehouse')
    @Auth('get_total_inventory_per_warehouse')
    async getTotalInventoryPerWarehouse(@CurrentTenant() tenantId: string) {
        return await this.reportService.getTotalInventoryPerWarehouse(tenantId);
    }

    @Get('low-stock-products')
    @Auth('get_low_stock_products')
    async getLowStockProducts(@CurrentTenant() tenantId: string) {
        return await this.reportService.getLowStockProducts(tenantId);
    }

    @Get('inventory-distribution-by-category')
    @Auth('get_inventory_distribution_by_category')
    async getInventoryDistributionByCategory(@CurrentTenant() tenantId: string) {
        return await this.reportService.getInventoryDistributionByCategory(tenantId);
    }
    
}
