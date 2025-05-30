import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { BaseCategoryDTO } from './dtos/base-category.dto';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';

@Controller('categories')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ){}

    @Get()
    @Auth("get_all_categories")
    getAllCategories(@CurrentTenant() tenantId: string) {
        return this.categoryService.getAllCategories(tenantId);
    }
    
    @Get(':id')
    @Auth("get_category_by_id")
    async getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }
    
    @Post()
    @Auth("create_category")
    @UsePipes(new ValidationPipe())
    async createCategory(@Body() createData: BaseCategoryDTO, @CurrentTenant() tenantId: string) {
        return this.categoryService.createCategory(createData, tenantId);
    }
    
    @Put(':id')
    @Auth("update_category")
    @UsePipes(new ValidationPipe())
    async updateCategory(@Param('id') id: string, @Body() updateData: BaseCategoryDTO, @CurrentTenant() tenantId: string) {
        return this.categoryService.updateCategory(id, updateData, tenantId);
    }
    
    @Delete(':id')
    @Auth("delete_category")
    async deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
