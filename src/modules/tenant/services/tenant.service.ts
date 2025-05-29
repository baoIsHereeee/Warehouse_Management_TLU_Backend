import { Injectable, BadRequestException } from '@nestjs/common';
import TenantRepository from '../repositories/tenant.repository';
import { CreateTenantDTO } from '../dtos/create-tenant.dto';


@Injectable()
export class TenantService {
    constructor(
        private tenantRepository: TenantRepository  
    ){}

    async createTenant(createTenantDTO: CreateTenantDTO) {
        const existingTenant = await this.tenantRepository.findOne({ where: { name: createTenantDTO.name }});

        if (existingTenant) throw new BadRequestException('Tenant already exists');
        
        const tenant = this.tenantRepository.create(createTenantDTO);
        return this.tenantRepository.save(tenant);
    }
}
