import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { CreateTenantDTO } from './dtos/create-tenant.dto';

@Controller('tenants')
export class TenantController {
    constructor(    
        private tenantService: TenantService
    ){}

    @Post()
    @UsePipes(new ValidationPipe())
    async createTenant(@Body() createTenantDTO: CreateTenantDTO) {
        return this.tenantService.createTenant(createTenantDTO);
    }
}