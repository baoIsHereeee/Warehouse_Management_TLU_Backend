import { Injectable, BadRequestException } from '@nestjs/common';
import TenantRepository from '../repositories/tenant.repository';
import { CreateTenantDTO } from '../dtos/create-tenant.dto';
import UserRepository from 'src/modules/user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class TenantService {
    constructor(
        private tenantRepository: TenantRepository,
        private userRepository: UserRepository,
        private configService: ConfigService,
        private authService: AuthService
    ){}

    async createTenant(createData: CreateTenantDTO) {
        // Convert Tenant Name
        createData.name = createData.name.toLowerCase().replace(/\s+/g, '');
        
        const existingTenant = await this.tenantRepository.findOne({ where: { name: createData.name }});

        if (existingTenant) throw new BadRequestException('Tenant already exists');
        
        const newTenant = this.tenantRepository.create(createData);

        const newDefaultAdminUser = this.userRepository.create({
            fullname: `${createData.name} - Default Admin`,
            age: 25,
            email: `${createData.name}@example.com`,
            password: this.authService.hashPassword(this.configService.get('DEFAULT_ADMIN_PASSWORD')!),
            tenant: newTenant
        });

        return {
            tenant: await this.tenantRepository.save(newTenant),
            user:  await this.userRepository.save(newDefaultAdminUser),
            message: "You may want to change the Default Information after Sign In"
        }
    }
}
