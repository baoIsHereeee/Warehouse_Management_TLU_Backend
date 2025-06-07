import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WarehouseService } from './services/warehouse.service';
import { CreateWarehouseDTO, CreateWarehouseTransferDTO, UpdateWarehouseDTO, UpdateWarehouseTransferDTO } from './dtos';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Warehouse } from './entities/warehouse.entity';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';
import { WarehouseTransfer } from './entities/warehouse-transfer.entity';
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

    @Get('transfers')
    @Auth("get_all_warehouse_transfers")
    getAllWarehouseTransfers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<WarehouseTransfer>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/warehouses/transfers', 
        };

        return this.warehouseService.getAllWarehouseTransfers(options, tenantId, query);
    }

    @Get('transfers/:id')
    @Auth("get_warehouse_transfer_by_id")
    async getWarehouseTransferById(@Param('id') id: string) {
        return this.warehouseService.getWarehouseTransferById(id);
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


    @Post('transfers')
    @Auth("create_warehouse_transfer")
    @UsePipes(new ValidationPipe())
    async createWarehouseTransfer(@Body() createData: CreateWarehouseTransferDTO, @CurrentTenant() tenantId: string) {
        return this.warehouseService.createWarehouseTransfer(createData, tenantId);
    }

    @Post()
    @Auth("create_warehouse")
    @UsePipes(new ValidationPipe())
    async createWarehouse(@Body() createData: CreateWarehouseDTO, @CurrentTenant() tenantId: string) {
        return this.warehouseService.createWarehouse(createData, tenantId);
    }

    @Put('transfers/:id')
    @Auth("update_warehouse_transfer")
    @UsePipes(new ValidationPipe())
    async updateWarehouseTransfer(@Param('id') id: string, @Body() updateData: UpdateWarehouseTransferDTO, @CurrentTenant() tenantId: string) {
        return this.warehouseService.updateWarehouseTransfer(id, updateData, tenantId);
    }

    @Put(':id')
    @Auth("update_warehouse")
    @UsePipes(new ValidationPipe())
    async updateWarehouse(@Param('id') id: string, @Body() updateData: UpdateWarehouseDTO, @CurrentTenant() tenantId: string) {
        return this.warehouseService.updateWarehouse(id, updateData, tenantId);
    }

    @Delete('transfers/:id')
    @Auth("delete_warehouse_transfer")
    async deleteWarehouseTransfer(@Param('id') id: string) {
        return this.warehouseService.deleteWarehouseTransfer(id);
    }

    @Delete(':id')
    @Auth("delete_warehouse")
    async deleteWarehouse(@Param('id') id: string) {
        return this.warehouseService.deleteWarehouse(id);
    }
}
