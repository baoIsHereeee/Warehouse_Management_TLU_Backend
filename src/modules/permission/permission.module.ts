import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './services/permission.service';
import PermissionRepository from './repositories/permission.repository';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionRepository, PermissionService],
  imports: [JwtModule],
})
export class PermissionModule {}
