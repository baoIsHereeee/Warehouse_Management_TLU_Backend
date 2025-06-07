import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/services/auth.service';
import PermissionRepository from '../../../modules/permission/repositories/permission.repository';
import RoleRepository from '../../../modules/role/repositories/role.repository';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { defaultUsers, permissions, roles, rolesPermissions } from '../seed.data';
import { Role } from '../../../modules/role/entities/role.entity';
import { Permission } from '../../../modules/permission/entities/permission.entity';
import RolePermissionRepository from '../../../modules/role/repositories/role-permission.repository';
@Injectable()
export class SeedService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private permissionRepository: PermissionRepository,
        private authService: AuthService,
        private rolePermissionRepository: RolePermissionRepository
    ){}

    async run() {
        try {
            // Seeding Roles
            const rolesToSeedData = roles.map(role => ({ name: role.name }));
            await this.roleRepository.createQueryBuilder()
                .insert()
                .into(Role) 
                .values(rolesToSeedData)
                .orIgnore() 
                .execute();

            console.log("Seeding Roles Successful!");

            // Seeding Permissions
            await this.permissionRepository.createQueryBuilder()
                .insert()
                .into(Permission) 
                .values(permissions)
                .orIgnore() 
                .execute();

            console.log("Seeding Permissions Successful!");

            // Seeding Role-Permission
            // for (const role_permission of rolesPermissions) {
            //     const role = await this.roleRepository.findOne({ where: { name: role_permission.role }, relations: ['rolePermissions'] });

            //     if (role) {
            //         for (const permissionName of role_permission.permissions) {
            //             const permission = await this.permissionRepository.findOneBy({ name: permissionName });
            //             const rolePermission = this.rolePermissionRepository.findOneBy({ roleId: role.id, permissionId: permission!.id });

            //             if (!rolePermission) {
            //                 const newRolePermission = this.rolePermissionRepository.create({
            //                     roleId: role.id,
            //                     permissionId: permission!.id
            //                 });
            //                 await this.rolePermissionRepository.save(newRolePermission);
            //             }
            //         }           

            //         await this.roleRepository.save(role);
            //     }
            // }
            // console.log("Seeding Roles-Permissions Successful!");
        
            // Seeding Default Admin User 
            // const role = await this.roleRepository.findOneBy({ name: "Admin" });
            // if (role) {
            //     for (const defaultUser of defaultUsers) {
            //         const existedUser = await this.userRepository.findOneBy({ email: defaultUser.email });

            //         if (!existedUser) {
            //             defaultUser.password = this.authService.hashPassword(defaultUser.password);
            //             const newDefaultUser = this.userRepository.create(defaultUser);
            
            //             newDefaultUser.roles = [role];
            //             await this.userRepository.save(newDefaultUser);
            //         }
            //     }

            //     console.log("Seeding Default Admin Users Successful!");
            // }
    
        } catch (error) {
            throw error;
        }
    }
}
