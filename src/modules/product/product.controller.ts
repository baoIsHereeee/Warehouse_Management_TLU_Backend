import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../decorators/permission.decorator';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}

    @Get()
    @Auth("get_all_products")
    getAllProducts(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Product>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/products', 
        };

        return this.productService.getAllProducts(options, query);
    }

    @Get(':id')
    @Auth("get_product_by_id")
    getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Post()
    @Auth("create_product")
    @UsePipes(new ValidationPipe())
    async createProduct(
        @Body() createProductDto: CreateProductDTO
    ) {
        return await this.productService.createProduct(createProductDto);
    }

    @Put(':id')
    @Auth("update_product")
    @UsePipes(new ValidationPipe())
    updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDTO) {
        return this.productService.updateProduct(id, updateData);
    }

    @Delete(':id')
    @Auth("delete_product")
    deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }
}
