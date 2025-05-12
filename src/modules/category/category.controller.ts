import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './entities/category.entity';
import { BaseCategoryDTO } from './dtos/base-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ){}

    @Get()
    getAllCategories(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Category>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/categories', 
        };

        return this.categoryService.getAllCategories(options, query);
    }
    
    @Get(':id')
    async getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }
    
    @Post()
    @UsePipes(new ValidationPipe())
    async createCategory(@Body() createData: BaseCategoryDTO) {
        return this.categoryService.createCategory(createData);
    }
    
    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateCategory(@Param('id') id: string, @Body() updateData: BaseCategoryDTO) {
        return this.categoryService.updateCategory(id, updateData);
    }
    
    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
