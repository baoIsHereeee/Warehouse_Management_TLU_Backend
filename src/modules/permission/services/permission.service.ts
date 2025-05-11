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
}
