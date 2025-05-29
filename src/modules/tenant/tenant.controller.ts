import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Query, Param } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { CreateTenantDTO } from './dtos/create-tenant.dto';

@Controller('tenants')
export class TenantController {
    constructor(    
        private tenantService: TenantService
    ){}

    @Get('check/:tenantName')
    async checkTenant(@Param('tenantName') tenantName: string) {
        return this.tenantService.checkTenant(tenantName);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createTenant(@Body() createTenantDTO: CreateTenantDTO) {
        return this.tenantService.createTenant(createTenantDTO);
    }
}