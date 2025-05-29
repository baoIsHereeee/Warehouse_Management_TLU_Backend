import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './tenant.controller';
import TenantRepository from './repositories/tenant.repository';

@Module({
  providers: [TenantService, TenantRepository],
  controllers: [TenantController]
})
export class TenantModule {}
