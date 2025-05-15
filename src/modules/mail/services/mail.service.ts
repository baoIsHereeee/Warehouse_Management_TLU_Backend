import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { get } from 'http';
import { Product } from 'src/modules/product/entities/product.entity';
import UserRepository from 'src/modules/user/repositories/user.repository';

@Injectable()
export class MailService {
    private adminEmails : string[] = [];

    constructor(
        private mailerService: MailerService,

        private userRepository: UserRepository,
    ) {}

    async onModuleInit() {
        const admins = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .where('role.name = :roleName', { roleName: 'Admin' })
            .select(['user.email'])
            .getMany();

            this.adminEmails = admins
            .map(admin => admin.email)
            .filter((email): email is string => email !== null && email !== undefined);
    }

    async sendCreateProductEmail(product: Product) {
        try {
            await this.mailerService.sendMail({
                to: this.adminEmails,
                subject: 'Product Created',
                template: 'product/create-product.template.hbs', 
                context: {
                    productData: product,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async sendUpdateProductEmail(oldProduct: Product, newProduct: Product) {
        try {
            await this.mailerService.sendMail({
                to: this.adminEmails,
                subject: 'Product Updated',
                template: 'product/update-product.template.hbs', 
                context: {
                    oldProductData: oldProduct,
                    newProductData: newProduct,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
