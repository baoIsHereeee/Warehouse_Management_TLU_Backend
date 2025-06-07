import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseRoleDTO } from './dtos/base-role.dto';
import { RoleService } from './services/role.service';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from '../../decorators/current-tenant.decorator';

@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ){}

    @Get()
    @Auth("get_all_roles")
    getAllRoles(@CurrentTenant() tenantId: string) {
        return this.roleService.getAllRoles(tenantId);
    }

    @Get(":id")
    @Auth("get_role_by_id")
    getRoleById(@Param('id') id: string) {
        return this.roleService.getRoleById(id);
    }

    @Post()
    @Auth("create_role")
    @UsePipes(new ValidationPipe())
    createRole(@Body() createData: BaseRoleDTO, @CurrentTenant() tenantId: string) {
        return this.roleService.createRole(createData, tenantId);
    }

    @Put(":id") 
    @Auth("update_role")
    @UsePipes(new ValidationPipe())
    updateRole(@Param('id') id: string, @Body() updateData: BaseRoleDTO, @CurrentTenant() tenantId: string) {
        return this.roleService.updateRole(id, updateData, tenantId);
    }

    @Delete(":id")
    @Auth("delete_role")
    deleteRole(@Param('id') id: string) {
        return this.roleService.deleteRole(id);
    }

    @Post("/:roleId/permissions/:permissionId")
    @Auth("create_role_permission")
    addRolePermission(@Param('roleId') roleId: string, @Param('permissionId') permissionId: number, @CurrentTenant() tenantId: string) {
        return this.roleService.addRolePermission(roleId, permissionId, tenantId);
    }

    @Delete("/:roleId/permissions/:permissionId")
    @Auth("delete_role_permission")
    removeRolePermission(@Param('roleId') roleId: string, @Param('permissionId') permissionId: number, @CurrentTenant() tenantId: string) {
        return this.roleService.removeRolePermission(roleId, permissionId, tenantId);
    }
}
