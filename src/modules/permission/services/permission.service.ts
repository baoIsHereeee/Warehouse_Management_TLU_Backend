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
            relations: ['rolePermissions.role']
        });

        return permission ? permission.rolePermissions.map(rolePermission => rolePermission.role.id) : [];
    }
}
