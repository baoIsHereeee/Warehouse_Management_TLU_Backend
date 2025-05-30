import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import RoleRepository from '../repositories/role.repository';
import { BaseRoleDTO } from '../dtos/base-role.dto';
import { Role } from '../entities/role.entity';
import PermissionRepository from '../../permission/repositories/permission.repository';
import RolePermissionRepository from '../repositories/role-permission.repository';

@Injectable()
export class RoleService {
    constructor(
        private roleRepository: RoleRepository,
        private permissionRepository: PermissionRepository,
        private rolePermissionRepository: RolePermissionRepository
    ){}

    async getAllRoles(tenantId: string) {
        return await this.roleRepository.find({
            where: { tenant: { id: tenantId } },
            relations: ['rolePermissions.permission'],
        });
    }

    async getRoleById(id: string) {
        const existingRole = await this.roleRepository.findOneBy({ id });
        if (!existingRole) throw new BadRequestException('Role not found! Please try again!');
        
        return await this.roleRepository.findOne({
            where: { id },
            relations: ['userRoles.user', 'rolePermissions.permission']
        });
    }

    async createRole(createData: BaseRoleDTO, tenantId: string) {
        const existingRole = await this.roleRepository.findOneBy({ name: createData.name, tenant: { id: tenantId } });
        if (existingRole) throw new BadRequestException('Role already exists! Please try again!');

        const newRole = this.roleRepository.create({...createData, tenant: { id: tenantId }});
        return await this.roleRepository.save(newRole);
    }

    async updateRole(id: string, updateData: BaseRoleDTO, tenantId: string) {
        const existingRole = await this.roleRepository.findOneBy({ id, tenant: { id: tenantId } });
        if (!existingRole) throw new BadRequestException('Role not found! Please try again!');

        const duplicateRole = await this.roleRepository.findOneBy({ name: updateData.name, tenant: { id: tenantId } });
        if (duplicateRole && duplicateRole.id !== id)   throw new BadRequestException('Role already exists! Please try again!');

        return await this.roleRepository.update(id, updateData);
    }

    async deleteRole(id: string) {
        const existingRole = await this.roleRepository.findOneBy({ id });
        if (!existingRole) throw new BadRequestException('Role not found! Please try again!');

        if (existingRole.name === 'Admin') throw new BadRequestException('Role Admin cannot be deleted!');

        return await this.roleRepository.delete(id);
    }

    async addRolePermission(roleId: string, permissionId: number, tenantId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId, tenant: { id: tenantId } }, relations: ['tenant'] });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) throw new NotFoundException("Role or Permission not found!");

        const newRolePermission = this.rolePermissionRepository.create({
            roleId: role.id,
            permissionId: permission.id,
            tenant: role.tenant
        });

        return await this.rolePermissionRepository.save(newRolePermission);
    }

    async removeRolePermission(roleId: string, permissionId: number, tenantId: string){
        const role = await this.roleRepository.findOne({ where: { id: roleId, tenant: { id: tenantId } } });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) throw new NotFoundException("Role or Permission not found!");

        const rolePermission = await this.rolePermissionRepository.findOne({ where: { roleId: role.id, permissionId: permission.id, tenant: { id: tenantId } } });
        if (!rolePermission) throw new NotFoundException("Role Permission not found!");

        return await this.rolePermissionRepository.delete(rolePermission);
    }

    async getUserRoles(userId: string) {
        const roles = await this.roleRepository.findBy({ userRoles: { userId } });
        return roles ? roles.map(role => role.id): [];
    }
}
