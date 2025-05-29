import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './tenant.controller';
import TenantRepository from './repositories/tenant.repository';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
@Module({
  providers: [TenantService, TenantRepository],
  controllers: [TenantController],
  exports: [TenantService, TenantRepository],
  imports: [UserModule, AuthModule, RoleModule]
})
export class TenantModule {}
