import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './services/permission.service';
import PermissionRepository from './repositories/permission.repository';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository]
})
export class PermissionModule {}
