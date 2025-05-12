import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CreateCustomerDTO, UpdateCustomerDTO } from './dtos';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomerController {
    constructor(
        private customerService: CustomerService
    ){}

    @Get()
    getAllUsers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Customer>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/customers', 
        };

        return this.customerService.getAllCustomers(options, query);
    }

    @Get(':id')
    async getCustomerById(@Param('id') id: string) {
        return this.customerService.getCustomerById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createCustomer(@Body() createData: CreateCustomerDTO) {
        return this.customerService.createCustomer(createData);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateCustomer(@Param('id') id: string, @Body() updateData: UpdateCustomerDTO) {
        return this.customerService.updateCustomer(id, updateData);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string) {
        return this.customerService.deleteCustomer(id);
    }
}
