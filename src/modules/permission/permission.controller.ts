import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './services/permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ) {}

    @Get()
    async getAllPermissions() {
        return this.permissionService.getAllPermissions();
    }
}
