import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import RoleRepository from './repositories/role.repository';
import { PermissionModule } from '../permission/permission.module';
import { JwtModule } from '../jwt/jwt.module';
import RolePermissionRepository from './repositories/role-permission.repository';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, RolePermissionRepository],
  imports: [TypeOrmModule.forFeature([Role, RolePermission]), PermissionModule, JwtModule],
  exports: [RoleRepository, RoleService, RolePermissionRepository],
})
export class RoleModule {}
