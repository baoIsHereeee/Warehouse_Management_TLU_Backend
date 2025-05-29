import { Injectable, BadRequestException } from '@nestjs/common';
import TenantRepository from '../repositories/tenant.repository';
import { CreateTenantDTO } from '../dtos/create-tenant.dto';
import UserRepository from 'src/modules/user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/services/auth.service';
import RoleRepository from 'src/modules/role/repositories/role.repository';

@Injectable()
export class TenantService {
    constructor(
        private tenantRepository: TenantRepository,
        private userRepository: UserRepository,
        private configService: ConfigService,
        private authService: AuthService,
        private roleRepository: RoleRepository
    ){}

    async createTenant(createData: CreateTenantDTO) {
        // Convert Tenant Name
        createData.name = createData.name.toLowerCase().replace(/\s+/g, '');
        
        const existingTenant = await this.tenantRepository.findOne({ where: { name: createData.name }});
        if (existingTenant) throw new BadRequestException('Tenant already exists');
        
        const newTenant = this.tenantRepository.create(createData);
        const savedTenant = await this.tenantRepository.save(newTenant);

        const defaultRoles = ['Admin', 'Manager', 'Staff'];
        for (const role of defaultRoles) {
            const newRole = this.roleRepository.create({ name: role, tenant: savedTenant });
            await this.roleRepository.save(newRole);
        }

        const newDefaultAdminUser = this.userRepository.create({
            fullname: `${createData.name} - Default Admin`,
            email: `${createData.name}@example.com`,
            password: this.authService.hashPassword(this.configService.get('DEFAULT_ADMIN_PASSWORD')!),
            tenant: newTenant,
        });

        const savedUser = await this.userRepository.save(newDefaultAdminUser);

        return {
            tenant: {
                id: savedTenant.id,
                name: savedTenant.name,
            },

            user:  { 
                id: savedUser.id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                password: this.configService.get('DEFAULT_ADMIN_PASSWORD'),
            },

            message: "You may want to change the Information (Email, Password) after Sign In"
        }
    }
}
