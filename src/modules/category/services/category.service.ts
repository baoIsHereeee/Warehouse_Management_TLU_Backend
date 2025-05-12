import { BadRequestException, Injectable } from '@nestjs/common';
import CategoryRepository from '../repositories/category.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Category } from '../entities/category.entity';
import { BaseCategoryDTO } from '../dtos/base-category.dto';
import ProductRepository from '../../../modules/product/repositories/product.repository';

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepository: CategoryRepository,
        private productRepository: ProductRepository,
    ){}


    async getAllCategories(options: IPaginationOptions, query?: string): Promise<Pagination<Category>> {
        const queryBuilder = this.categoryRepository.createQueryBuilder('category');

        if (query) queryBuilder.where('LOWER(category.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Category>(queryBuilder, options);
    }

    async getCategoryById(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
        if (!category) throw new BadRequestException('Category not found! Please try again!');
        
        return category;
    }

    async createCategory(creataData: BaseCategoryDTO) {
        const existeingCategory = await this.categoryRepository.findOne({ where: { name: creataData.name } });
        if (existeingCategory) throw new BadRequestException('Category already exists! Please try again!');

        const newCategory = this.categoryRepository.create(creataData);
        return await this.categoryRepository.save(newCategory);
    }

    async updateCategory(id: string, updateData: BaseCategoryDTO) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) throw new BadRequestException('Category not found! Please try again!');

        const existeingCategory = await this.categoryRepository.findOne({ where: { name: updateData.name } });
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

