import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import ProductRepository from '../repositories/product.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Product } from '../entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from '../dtos';
import CategoryRepository from '../../../modules/category/repositories/category.repository';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { MailService } from '../../../modules/mail/services/mail.service';
import { FirebaseService } from '../../firebase/services/firebase.service';

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository,
        private mailService: MailService,
        private firebaseService: FirebaseService,
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

    async createProduct(createData: CreateProductDTO, file?: Express.Multer.File) {
        const currentUser = await this.userRepository.findOne({ where: { id: createData.userId } });
        if (!currentUser) throw new NotFoundException('User not found! Please try again!');

        let imageUrl: string | undefined;

        if (file) {
            console.log('Uploading product image...');
            try {
                imageUrl = await this.firebaseService.uploadFile(file, 'products');
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('No product image provided!');
        }

        const product = this.productRepository.create({
            ...createData,
            image: imageUrl,
            user: currentUser,
            category: createData.categoryId ? await this.categoryRepository.findOne({ where: { id: createData.categoryId } }) : null,
        });
        
        const savedProduct = await this.productRepository.save(product);

        this.mailService.sendCreateProductEmail(savedProduct);

        return await this.productRepository.findOne({ where: { id: savedProduct.id }, relations: ['user', 'category'] });
    }

    async updateProduct(id: string, updateData: UpdateProductDTO) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['exportDetails'] });
        if (!product) throw new NotFoundException('Product not found! Please try again!');

        if (product.exportDetails.length > 0) throw new BadRequestException('This Product has already been exported! Cannot update information!');

        const oldProduct = { ...product };

        if (updateData.categoryId){
            const category = await this.categoryRepository.findOne({ where: { id: updateData.categoryId } });
            if (!category) throw new NotFoundException('Category not found! Please try again!');

            product.category = category;
            await this.productRepository.save(product);
        }

        const { categoryId, ...rest } = updateData;
        await this.productRepository.update(id, rest); 

        const updatedProduct = await this.productRepository.findOne({ where: { id }, relations: ['user', 'category'] }) as Product;

        this.mailService.sendUpdateProductEmail(oldProduct, updatedProduct);

        return updatedProduct;
    }

    async deleteProduct(id: string) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['exportDetails'] });
        if (!product) throw new NotFoundException('Product not found! Please try again!');

        if (product.exportDetails.length > 0) throw new BadRequestException('This Product has already been exported! Cannot delete product!');

        return await this.productRepository.softDelete(id);
    }
}
