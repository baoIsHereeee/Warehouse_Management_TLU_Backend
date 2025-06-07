import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import UserRepository from './repositories/user.repository';
import { RoleModule } from '../role/role.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import UserRoleRepository from './repositories/user-role.repository';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRoleRepository],
  imports: [AuthModule, RoleModule, ConfigModule, JwtModule, PermissionModule, TenantModule],
  exports: [UserRepository, UserRoleRepository]
})
export class UserModule {}
