import { SupplierService } from './services/supplier.service';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDTO, UpdateSupplierDTO } from './dtos';

@Controller('suppliers')
export class SupplierController {
    constructor(
        private supplierService: SupplierService
    ) {}


    @Get()
    getAllSuppliers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Supplier>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/suppliers', 
        };

        return this.supplierService.getAllSuppliers(options, query);
    }

    @Get(':id')
    async getSupplierById(@Param('id') id: string) {
        return this.supplierService.getSupplierById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createSupplier(@Body() createData: CreateSupplierDTO) {
        return this.supplierService.createSupplier(createData);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateSupplier(@Param('id') id: string, @Body() updateData: UpdateSupplierDTO) {
        return this.supplierService.updateSupplier(id, updateData);
    }

    @Delete(':id')
    async deleteSupplier(@Param('id') id: string) {
        return this.supplierService.deleteSupplier(id);
    }
}
