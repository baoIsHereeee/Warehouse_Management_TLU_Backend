import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './services/user.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { CreateUserDTO, SignInPayload, UpdateUserDTO } from './dtos';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from '../../decorators/current-tenant.decorator';

@Controller()
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Post('sign-in/:tenantName')
    @UsePipes(new ValidationPipe())
    signIn(@Body() payload: SignInPayload, @Param('tenantName') tenantName: string) {
        return this.userService.signIn(payload, tenantName);
    }

    @Get("users")
    @Auth("get_all_users")
    getAllUsers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<User>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/users', 
        };

        return this.userService.getAllUsers(options, tenantId, query);
    }

    @Get("users/:id")
    @Auth("get_user_by_id")
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Post("users")
    @Auth("create_user")
    @UsePipes(new ValidationPipe())
    createUser(@Body() createData: CreateUserDTO, @CurrentTenant() tenantId: string) {
        return this.userService.createUser(createData, tenantId);
    }

    @Put("users/:id")
    @Auth("update_user")
    @UsePipes(new ValidationPipe())
    updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDTO, @CurrentTenant() tenantId: string) {
        return this.userService.updateUser(id, updateData, tenantId);
    }

    @Delete("users/:id")
    @Auth("delete_user")
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Post("users-roles/:roleId/:userId")
    @Auth("add_user_role")
    addUserRole(@Param('roleId') roleId: string, @Param('userId') userId: string, @CurrentTenant() tenantId: string) {
        return this.userService.addUserRole(roleId, userId, tenantId);
    }

    @Delete("users-roles/:roleId/:userId")
    @Auth("delete_user_role")
    removeUserRole(@Param('roleId') roleId: string, @Param('userId') userId: string, @CurrentTenant() tenantId: string) {
        return this.userService.removeUserRole(roleId, userId, tenantId);
    }
}
