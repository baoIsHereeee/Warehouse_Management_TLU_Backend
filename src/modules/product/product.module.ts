import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';
import ProductRepository from './repositories/product.repository';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
  imports: [forwardRef(() => CategoryModule), UserModule, MailModule, FirebaseModule, JwtModule, PermissionModule],
})
export class ProductModule {}
