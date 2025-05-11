import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseRoleDTO } from './dtos/base-role.dto';
import { RoleService } from './services/role.service';

@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ){}

    @Get()
    getAllRoles() {
        return this.roleService.getAllRoles();
    }

    @Get(":id")
    getRoleById(@Param('id') id: string) {
        return this.roleService.getRoleById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createRole(@Body() createData: BaseRoleDTO) {
        return this.roleService.createRole(createData);
    }

    @Put(":id") 
    @UsePipes(new ValidationPipe())
    updateRole(@Param('id') id: string, @Body() updateData: BaseRoleDTO) {
        return this.roleService.updateRole(id, updateData);
    }

    @Delete(":id")
    deleteRole(@Param('id') id: string) {
        return this.roleService.deleteRole(id);
    }

    // @Post("/:roleId/permissions/:permissionId")
    // addRolePermission(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number) {
    //     return this.roleService.addRolePermission(roleId, permissionId);
    // }

    // @Delete("/:roleId/permissions/:permissionId")
    // removeRolePermission(@Param('roleId') roleId: number,@Param('permissionId') permissionId: number) {
    //     return this.roleService.removeRolePermission(roleId, permissionId);
    // }
}
