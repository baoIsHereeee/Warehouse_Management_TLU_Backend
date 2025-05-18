import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './entities/category.entity';
import { BaseCategoryDTO } from './dtos/base-category.dto';
import { Auth } from '../../decorators/permission.decorator';

@Controller('categories')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ){}

    @Get()
    @Auth("get_all_categories")
    getAllCategories() {
        return this.categoryService.getAllCategories();
    }
    
    @Get(':id')
    @Auth("get_category_by_id")
    async getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }
    
    @Post()
    @Auth("create_category")
    @UsePipes(new ValidationPipe())
    async createCategory(@Body() createData: BaseCategoryDTO) {
        return this.categoryService.createCategory(createData);
    }
    
    @Put(':id')
    @Auth("update_category")
    @UsePipes(new ValidationPipe())
    async updateCategory(@Param('id') id: string, @Body() updateData: BaseCategoryDTO) {
        return this.categoryService.updateCategory(id, updateData);
    }
    
    @Delete(':id')
    @Auth("delete_category")
    async deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
