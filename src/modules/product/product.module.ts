import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
