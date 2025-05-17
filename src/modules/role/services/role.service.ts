import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import RoleRepository from '../repositories/role.repository';
import { BaseRoleDTO } from '../dtos/base-role.dto';
import { Role } from '../entities/role.entity';
import PermissionRepository from '../../permission/repositories/permission.repository';
@Injectable()
export class RoleService {
    constructor(
        private roleRepository: RoleRepository,
        private permissionRepository: PermissionRepository
    ){}

    async getAllRoles() {
        return await this.roleRepository.find({
            relations: ['users', 'permissions'],
        });
    }

    async getRoleById(id: string) {
        const existingRole = await this.roleRepository.findOneBy({ id });
        if (!existingRole) throw new BadRequestException('Role not found! Please try again!');
        
        return await this.roleRepository.findOne({
            where: { id },
            relations: ['users']
        });
    }

    async createRole(createData: BaseRoleDTO) {
        const existingRole = await this.roleRepository.findOneBy({ name: createData.name });
        if (existingRole) throw new BadRequestException('Role already exists! Please try again!');

        const newRole = this.roleRepository.create(createData);
        return await this.roleRepository.save(newRole);
    }

    async updateRole(id: string, updateData: BaseRoleDTO) {
        const existingRole = await this.roleRepository.findOneBy({ id });
        if (!existingRole) throw new BadRequestException('Role not found! Please try again!');

        const duplicateRole = await this.roleRepository.findOneBy({ name: updateData.name });
        if (duplicateRole && duplicateRole.id !== id)   throw new BadRequestException('Role already exists! Please try again!');

        return await this.roleRepository.update(id, updateData);
    }

    async deleteRole(id: string) {
        const existingRole = await this.roleRepository.findOneBy({ id });
        if (!existingRole) throw new BadRequestException('Role not found! Please try again!');

        if (existingRole.name === 'Admin') throw new BadRequestException('Role Admin cannot be deleted!');

        return await this.roleRepository.delete(id);
    }

    async addRolePermission(roleId: string, permissionId: number) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) throw new NotFoundException("Role or Permission not found!");

        return await this.roleRepository
            .createQueryBuilder()
            .relation(Role, 'permissions')
            .of(role)
            .add(permission);
    }

    async removeRolePermission(roleId: string, permissionId: number){
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) throw new NotFoundException("Role or Permission not found!");

        return await this.roleRepository
            .createQueryBuilder()
            .relation(Role, 'permissions')
            .of(role)
            .remove(permission);
    }

    async getUserRoles(userId: string) {
        const roles = await this.roleRepository.findBy({ users: { id: userId } });
        return roles ? roles.map(role => role.id): [];
    }
}
