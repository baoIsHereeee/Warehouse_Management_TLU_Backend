import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WarehouseService } from './services/warehouse.service';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from './dtos';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Warehouse } from './entities/warehouse.entity';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';
@Controller('warehouses')
export class WarehouseController {
    constructor(
        private warehouseService: WarehouseService
    ){}

    @Get()
    @Auth("get_all_warehouses")
    getAllWarehouses(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<Warehouse>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/warehouses', 
        };

        return this.warehouseService.getAllWarehouses(options, tenantId, query);
    }

    @Get('list/:tenantId')
    @Auth("get_all_warehouses")
    getAllWarehouseList(@Param('tenantId') tenantId: string){
        return this.warehouseService.getAllWarehouseList(tenantId);
    }

    @Get(':id')
    @Auth("get_warehouse_by_id")
    async getWarehouseById(@Param('id') id: string) {
        return this.warehouseService.getWarehouseById(id);
    }

    @Post()
    @Auth("create_warehouse")
    @UsePipes(new ValidationPipe())
    async createWarehouse(@Body() createData: CreateWarehouseDTO, @CurrentTenant() tenantId: string) {
        return this.warehouseService.createWarehouse(createData, tenantId);
    }

    @Put(':id')
    @Auth("update_warehouse")
    @UsePipes(new ValidationPipe())
    async updateWarehouse(@Param('id') id: string, @Body() updateData: UpdateWarehouseDTO, @CurrentTenant() tenantId: string) {
        return this.warehouseService.updateWarehouse(id, updateData, tenantId);
    }

    @Delete(':id')
    @Auth("delete_warehouse")
    async deleteWarehouse(@Param('id') id: string) {
        return this.warehouseService.deleteWarehouse(id);
    }
}
