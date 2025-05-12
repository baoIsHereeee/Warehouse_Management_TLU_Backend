import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';
import ProductRepository from './repositories/product.repository';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
  imports: [forwardRef(() => CategoryModule), UserModule],
})
export class ProductModule {}
