import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './services/user.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from './dtos';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Get()
    getAllUsers(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<User>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/users', 
        };

        return this.userService.getAllUsers(options, query);
    }

    @Get(":id")
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createData: CreateUserDTO) {
        return this.userService.createUser(createData);
    }

    @Put(":id")
    @UsePipes(new ValidationPipe())
    updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDTO) {
        return this.userService.updateUser(id, updateData);
    }

    @Delete(":id")
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
