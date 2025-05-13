import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WarehouseService } from './services/warehouse.service';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from './dtos';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Warehouse } from './entities/warehouse.entity';

@Controller('warehouses')
export class WarehouseController {
    constructor(
        private warehouseService: WarehouseService
    ){}

    @Get()
    getAllUsers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Warehouse>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/warehouses', 
        };

        return this.warehouseService.getAllWarehouses(options, query);
    }

    @Get(':id')
    async getWarehouseById(@Param('id') id: string) {
        return this.warehouseService.getWarehouseById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createWarehouse(@Body() createData: CreateWarehouseDTO) {
        return this.warehouseService.createWarehouse(createData);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateWarehouse(@Param('id') id: string, @Body() updateData: UpdateWarehouseDTO) {
        return this.warehouseService.updateWarehouse(id, updateData);
    }

    @Delete(':id')
    async deleteWarehouse(@Param('id') id: string) {
        return this.warehouseService.deleteWarehouse(id);
    }
}
