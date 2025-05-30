import { BadRequestException, Injectable } from '@nestjs/common';
import CategoryRepository from '../repositories/category.repository';
import { BaseCategoryDTO } from '../dtos/base-category.dto';
import ProductRepository from '../../../modules/product/repositories/product.repository';
import { Not } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepository: CategoryRepository,
        private productRepository: ProductRepository,
    ){}


    async getAllCategories(tenantId: string) {
        return await this.categoryRepository.find({ where: { tenant: { id: tenantId } } });
    }

    async getCategoryById(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
        if (!category) throw new BadRequestException('Category not found! Please try again!');
        
        return category;
    }

    async createCategory(creataData: BaseCategoryDTO, tenantId: string) {
        const existeingCategory = await this.categoryRepository.findOne({ where: { name: creataData.name, tenant: { id: tenantId } } });
        if (existeingCategory) throw new BadRequestException('Category already exists! Please try again!');

        const newCategory = this.categoryRepository.create({ ...creataData, tenant: { id: tenantId } });
        return await this.categoryRepository.save(newCategory);
    }

    async updateCategory(id: string, updateData: BaseCategoryDTO, tenantId: string) {
        const category = await this.categoryRepository.findOne({ where: { id, tenant: { id: tenantId } } });
        if (!category) throw new BadRequestException('Category not found! Please try again!');

        const existeingCategory = await this.categoryRepository.findOne({ where: { name: updateData.name, id: Not(id), tenant: { id: tenantId } } });
        if (existeingCategory) throw new BadRequestException('Category already exists! Please try again!');

        return await this.categoryRepository.update(id, updateData);
    }

    async deleteCategory(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) throw new BadRequestException('Category not found! Please try again!');

        await this.productRepository
        .createQueryBuilder()
        .update()
        .set({ category: null })
        .where('category_id = :id', { id })
        .execute();

        return await this.categoryRepository.softDelete(id);
    }

}

