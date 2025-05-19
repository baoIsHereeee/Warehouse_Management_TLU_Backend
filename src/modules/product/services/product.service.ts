import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import ProductRepository from '../repositories/product.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Product } from '../entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from '../dtos';
import CategoryRepository from '../../../modules/category/repositories/category.repository';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { MailService } from '../../../modules/mail/services/mail.service';
import { CloudinaryService } from '../../../modules/cloudinary/services/cloudinary.service';

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository,
        private mailService: MailService,
        private cloudinaryService: CloudinaryService,
    ){}

    async getAllProducts(options: IPaginationOptions, query?: string): Promise<Pagination<Product>> {
        const queryBuilder = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category'); 


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
            try {
                const result = await this.cloudinaryService.uploadFile(file) as { secure_url: string };;
                imageUrl = result.secure_url;
            } catch (error) {
                throw new BadRequestException('Failed to upload product image');
            }
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

    async updateProduct(id: string, updateData: UpdateProductDTO, file?: Express.Multer.File) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['exportDetails'] });
        if (!product) throw new NotFoundException('Product not found! Please try again!');

        if (updateData.name) if (product.exportDetails.length > 0) throw new BadRequestException('This Product has already been exported! Cannot update information!');
            
        const oldProduct = { ...product };

        if (file) {
            try {
                if (product.image) {
                    const publicId = product.image.split('/').slice(-1)[0].split('.')[0];
                    await this.cloudinaryService.deleteFile(publicId);
                }

                const result = await this.cloudinaryService.uploadFile(file) as { secure_url: string };
                product.image = result.secure_url;
            } catch (error) {
                console.log("Failed to update product's image: ", error);
            }
        } else if (updateData.image === '') {
            if (product.image) {
                try {
                    const publicId = product.image.split('/').slice(-1)[0].split('.')[0];
                    await this.cloudinaryService.deleteFile(publicId);
                } catch (error) {
                    console.log("Failed to delete old image: ", error);
                }
            }
            product.image = null;
        }

        if (updateData.categoryId){
            const category = await this.categoryRepository.findOne({ where: { id: updateData.categoryId } });
            if (!category) throw new NotFoundException('Category not found! Please try again!');

            product.category = category;
            await this.productRepository.save(product);
        }

        if (updateData.minimumStock === null) {
            product.minimumStock = null;
            product.orderStock = null;
            await this.productRepository.save(product);
        }

        const { categoryId, ...rest } = updateData;
        await this.productRepository.update(id, { ...rest, image: product.image }); 

        const updatedProduct = await this.productRepository.findOne({ where: { id }, relations: ['user', 'category'] }) as Product;

        this.mailService.sendUpdateProductEmail(oldProduct, updatedProduct);

        return updatedProduct;
    }

    async deleteProduct(id: string) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['exportDetails'] });
        if (!product) throw new NotFoundException('Product not found! Please try again!');

        if (product.exportDetails.length > 0) throw new BadRequestException('This Product has already been exported! Cannot delete product!');

        if (product.image) {
            try {
                const publicId = product.image.split('/').slice(-1)[0].split('.')[0];
                await this.cloudinaryService.deleteFile(publicId);
            } catch (error) {
                console.error("Failed to delete product's image:", error);
            }
        }

        return await this.productRepository.softDelete(id);
    }
}
