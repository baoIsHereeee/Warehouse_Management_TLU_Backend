import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import RoleRepository from './repositories/role.repository';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  exports: [RoleRepository],
})
export class RoleModule {}
