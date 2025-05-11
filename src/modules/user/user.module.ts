import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import UserRepository from './repositories/user.repository';
import { RoleModule } from '../role/role.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, RoleModule, ConfigModule, JwtModule],
  exports: [UserRepository]
})
export class UserModule {}
