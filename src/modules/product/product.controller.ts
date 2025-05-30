import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';
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
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<Product>>{
        limit = limit > 10 ? 10 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/products', 
        };

        return this.productService.getAllProducts(options, tenantId, query);
    }

    @Get('list/:tenantId')
    @Auth("get_all_products")
    getAllProductList(@Param('tenantId') tenantId: string){
        return this.productService.getAllProductList(tenantId);
    }

    @Get(':id')
    @Auth("get_product_by_id")
    getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Post()
    @Auth("create_product")
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new ValidationPipe({ transform: true }))
    async createProduct(
        @Body() createProductDto: CreateProductDTO,
        @UploadedFile() file: Express.Multer.File,
        @CurrentTenant() tenantId: string
    ) {
        return await this.productService.createProduct(createProductDto, tenantId, file);
    }

    @Put(':id')
    @Auth("update_product")
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new ValidationPipe({ transform: true }))
    updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDTO, @UploadedFile() file: Express.Multer.File, @CurrentTenant() tenantId: string) {
        return this.productService.updateProduct(id, updateData, tenantId, file);
    }

    @Delete(':id')
    @Auth("delete_product")
    deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }
}
