import { Injectable } from '@nestjs/common';
import PermissionRepository from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
    constructor(
        private permissionRepository: PermissionRepository,
    ){}

    getAllPermissions() {
        return this.permissionRepository.find();
    }

    async getPermissionRoles(requestPermission: string) {
        const permission = await this.permissionRepository.findOne({
            where: { name: requestPermission },
            relations: ['roles']
        });

        return permission ? permission.roles.map(role => role.id) : [];
    }
}
