import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTenantDTO } from '../dtos/create-tenant.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/services/auth.service';
import { DataSource } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { rolesPermissions } from '../../../databases/seeds/seed.data';
import { RolePermission } from '../../role/entities/role-permission.entity';
import { UserRole } from '../../../modules/user/entities/user-role.entity';

@Injectable()
export class TenantService {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
        private dataSource: DataSource
    ){}

    async checkTenant(name: string) {
        const existingTenant = await this.dataSource.manager.findOne(Tenant, { where: { name } });

        if (existingTenant) return true;

        throw new NotFoundException('Tenant not found! Please try again!');
    }

    async createTenant(createData: CreateTenantDTO) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Convert Tenant Name
            createData.name = createData.name.toLowerCase().replace(/\s+/g, '');
            
            const existingTenant = await queryRunner.manager.findOne(Tenant, { 
                where: { name: createData.name }
            });

            if (existingTenant) throw new BadRequestException('Tenant already exists! Please try again!');

            const existingEmail = await queryRunner.manager.findOne(User, { 
                where: { email: createData.email }
            });

            if (existingEmail) throw new BadRequestException('Email already exists! Please try again!');
            
            const newTenant = queryRunner.manager.create(Tenant, createData);
            const savedTenant = await queryRunner.manager.save(newTenant);

            const defaultRoles = ['Admin', 'Manager', 'Staff'];
            for (const role of defaultRoles) {
                const newRole = queryRunner.manager.create(Role, { 
                    name: role, 
                    tenant: savedTenant 
                });
                await queryRunner.manager.save(newRole);
            }

            for (const role_permission of rolesPermissions) {
                const role = await queryRunner.manager.findOne(Role, { where: { name: role_permission.role, tenant: { id: savedTenant.id } }});

                if (role) {
                    for (const permissionName of role_permission.permissions) {
                        const permission = await queryRunner.manager.findOne(Permission, { where: { name: permissionName } });
                        
                        const newRolePermission = queryRunner.manager.create(RolePermission, {
                            roleId: role.id,
                            permissionId: permission!.id,
                            tenant: savedTenant
                        });

                        await queryRunner.manager.save(newRolePermission);

                    }
                }
            }

            const adminRole = await queryRunner.manager.findOne(Role, { where: { name: 'Admin', tenant: { id: savedTenant.id } } });

            const newDefaultAdminUser = queryRunner.manager.create(User, {
                fullname: `${createData.name} - Default Admin`,
                email: createData.email,
                password: this.authService.hashPassword(this.configService.get('DEFAULT_ADMIN_PASSWORD')!),
                tenant: savedTenant,
            });

            const savedUser = await queryRunner.manager.save(newDefaultAdminUser);

            const newUserRole = queryRunner.manager.create(UserRole, {
                roleId: adminRole!.id,
                userId: savedUser.id,
                tenant: savedTenant
            });

            await queryRunner.manager.save(newUserRole);

            await queryRunner.commitTransaction();

            return {
                tenant: {
                    id: savedTenant.id,
                    name: savedTenant.name,
                },
                user: { 
                    id: savedUser.id,
                    fullname: savedUser.fullname,
                    email: savedUser.email,
                    password: this.configService.get('DEFAULT_ADMIN_PASSWORD'),
                },
                message: "You may want to change the Information (Email, Password) after Sign In"
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
