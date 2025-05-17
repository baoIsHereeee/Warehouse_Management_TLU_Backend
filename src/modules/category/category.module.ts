import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './services/category.service';
import CategoryRepository from './repositories/category.repository';
import { ProductModule } from '../product/product.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  imports: [ProductModule, JwtModule, PermissionModule],
  exports: [CategoryRepository]
})
export class CategoryModule {}
