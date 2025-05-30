import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CreateCustomerDTO, UpdateCustomerDTO } from './dtos';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Customer } from './entities/customer.entity';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';

@Controller('customers')
export class CustomerController {
    constructor(
        private customerService: CustomerService
    ){}

    @Get()
    @Auth("get_all_customers")
    getAllCustomers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<Customer>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/customers', 
        };

        return this.customerService.getAllCustomers(options, tenantId, query);
    }

    @Get('list/:tenantId')
    @Auth("get_all_customers")
    getAllCustomerList(@Param('tenantId') tenantId: string){
        return this.customerService.getAllCustomerList(tenantId);
    }

    @Get(':id')
    @Auth("get_customer_by_id")
    async getCustomerById(@Param('id') id: string) {
        return this.customerService.getCustomerById(id);
    }

    @Post()
    @Auth("create_customer")
    @UsePipes(new ValidationPipe())
    async createCustomer(@Body() createData: CreateCustomerDTO, @CurrentTenant() tenantId: string) {
        return this.customerService.createCustomer(createData, tenantId);
    }

    @Put(':id')
    @Auth("update_customer")
    @UsePipes(new ValidationPipe())
    async updateCustomer(@Param('id') id: string, @Body() updateData: UpdateCustomerDTO, @CurrentTenant() tenantId: string) {
        return this.customerService.updateCustomer(id, updateData, tenantId);
    }

    @Delete(':id')
    @Auth("delete_customer")
    async deleteCustomer(@Param('id') id: string) {
        return this.customerService.deleteCustomer(id);
    }
}
