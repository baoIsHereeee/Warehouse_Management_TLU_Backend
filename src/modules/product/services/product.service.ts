import { Injectable, NotFoundException } from '@nestjs/common';
import ProductRepository from '../repositories/product.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Product } from '../entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from '../dtos';
import CategoryRepository from 'src/modules/category/repositories/category.repository';
import UserRepository from 'src/modules/user/repositories/user.repository';

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository,
    ){}

    async getAllProducts(options: IPaginationOptions, query?: string): Promise<Pagination<Product>> {
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        if (query) queryBuilder.where('LOWER(product.name) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Product>(queryBuilder, options);
    }

    async getProductById(id: string) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['user', 'category'] });

        if (!product) throw new NotFoundException('Product not found! Please try again!');

        return product;
    }

    async createProduct(createData: CreateProductDTO) {
        const currentUser = await this.userRepository.findOne({ where: { id: createData.userId } });
        if (!currentUser) throw new NotFoundException('User not found! Please try again!');

        const product = this.productRepository.create({
            ...createData,
            user: currentUser,
            category: createData.categoryId ? await this.categoryRepository.findOne({ where: { id: createData.categoryId } }) : null,
        });
        
        return await this.productRepository.save(product);
    }

    async updateProduct(id: string, updateData: UpdateProductDTO) {
        const product = await this.getProductById(id);
        if (!product) throw new NotFoundException('Product not found! Please try again!');

        if (updateData.category_id){
            const category = await this.categoryRepository.findOne({ where: { id: updateData.category_id } });
            if (!category) throw new NotFoundException('Category not found! Please try again!');

            const { category_id, ...updateDataWithoutCategoryID } = updateData;
            const newUpdateData = { ...updateDataWithoutCategoryID, category: category} ;

            return await this.productRepository.update(id, newUpdateData);
        }

        return await this.productRepository.update(id, updateData); 
    }

    async deleteProduct(id: string) {
        const product = await this.getProductById(id);
        if (!product) throw new NotFoundException('Product not found! Please try again!');

        return await this.productRepository.softDelete(id);
    }
}
