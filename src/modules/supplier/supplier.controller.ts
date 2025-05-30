import { SupplierService } from './services/supplier.service';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDTO, UpdateSupplierDTO } from './dtos';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';

@Controller('suppliers')
export class SupplierController {
    constructor(
        private supplierService: SupplierService
    ) {}


    @Get()
    @Auth("get_all_suppliers")
    getAllSuppliers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<Supplier>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/suppliers', 
        };

        return this.supplierService.getAllSuppliers(options, tenantId, query);
    }

    @Get('list/:tenantId')
    @Auth("get_all_suppliers")
    async getSupplierList(@Param('tenantId') tenantId: string) {
        return this.supplierService.getSupplierList(tenantId);
    }

    @Get(':id')
    @Auth("get_supplier_by_id")
    async getSupplierById(@Param('id') id: string) {
        return this.supplierService.getSupplierById(id);
    }

    @Post()
    @Auth("create_supplier")
    @UsePipes(new ValidationPipe())
    async createSupplier(@Body() createData: CreateSupplierDTO, @CurrentTenant() tenantId: string) {
        return this.supplierService.createSupplier(createData, tenantId);
    }

    @Put(':id')
    @Auth("update_supplier")
    @UsePipes(new ValidationPipe())
    async updateSupplier(@Param('id') id: string, @Body() updateData: UpdateSupplierDTO, @CurrentTenant() tenantId: string) {
        return this.supplierService.updateSupplier(id, updateData, tenantId);
    }

    @Delete(':id')
    @Auth("delete_supplier")
    async deleteSupplier(@Param('id') id: string) {
        return this.supplierService.deleteSupplier(id);
    }
}
