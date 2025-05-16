import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}

    @Get()
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
    getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new ValidationPipe())
    async createProduct(
        @Body() createProductDto: CreateProductDTO,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.productService.createProduct(createProductDto, file);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDTO) {
        return this.productService.updateProduct(id, updateData);
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }
}
