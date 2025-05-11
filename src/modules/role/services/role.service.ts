import { BadRequestException, Injectable } from '@nestjs/common';
import RoleRepository from '../repositories/role.repository';
import { BaseRoleDTO } from '../dtos/base-role.dto';

@Injectable()
export class RoleService {
    constructor(
        private roleRepository: RoleRepository,
    ){}

    async getAllRoles() {
        return await this.roleRepository.find({
            relations: ['users']
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

        return await this.roleRepository.delete(id);
    }
}
