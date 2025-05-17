import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateUserDTO, SignInPayload, UpdateUserDTO } from '../dtos';
import { AuthService } from '../../auth/services/auth.service';
import { ConfigService } from '@nestjs/config';
import UserRepository from '../repositories/user.repository';
import RoleRepository from '../../role/repositories/role.repository';
import { Role } from '../../role/entities/role.entity';
import { JwtService } from '../../jwt/services/jwt.service';
import { RoleService } from '../../../modules/role/services/role.service';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private configService: ConfigService,
        private roleRepository: RoleRepository,
        private jwtService: JwtService,
        private roleService: RoleService
    ) {}

    async getAllUsers(options: IPaginationOptions, query?: string): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (query) queryBuilder.where('LOWER(user.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<User>(queryBuilder, options);
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles']
        });
        if (!user) throw new NotFoundException('User not found! Please try again!');

        return user;
    }

    async createUser(createData: CreateUserDTO) {
        const user = await this.userRepository.findOne({ where: { email: createData.email } });
        if (user) throw new BadRequestException('Email already exists! Please try again!');

        const newUser = this.userRepository.create(createData);

        const hashedPassword = this.authService.hashPassword(createData.password);  
        newUser.password = hashedPassword;

        const staffRole = await this.roleRepository.findOne({ where: { name: 'Staff' } }) as Role;
        newUser.roles = [staffRole];

        return await this.userRepository.save(newUser);
    }

    async updateUser(id: string, updateData: UpdateUserDTO) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found! Please try again!');

        if (updateData.email) {
            const existedEmail = await this.userRepository.findOne({ where: { email: updateData.email } });
            if (existedEmail && existedEmail.id !== id) throw new BadRequestException('Email already exists! Please try again!');
        }

        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found! Please try again!');

        user.email = null;
        await this.userRepository.save(user);

        return this.userRepository.softDelete(id);
    }

    async addUserRole(roleId: string, userId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!role || !user) throw new NotFoundException("Role or User not found!");

        return await this.roleRepository
            .createQueryBuilder()
            .relation(Role, 'users')
            .of(role)
            .add(user);
    }

    async removeUserRole(roleId: string, userId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!role || !user) throw new NotFoundException("Role or Usser not found!");

        return await this.userRepository
            .createQueryBuilder()
            .relation(User, 'roles')
            .of(user)
            .remove(role);
    }

    async signIn(payload: SignInPayload) {
        const user = await this.userRepository.findOne({ where: { email: payload.email}, relations: ['roles'] });
        if (!user) throw new NotFoundException("Email not exist! Please try again!");

        const checkPassword = await this.authService.comparePassword(payload.password, user.password);
        if(!checkPassword) throw new BadRequestException("Password is incorrect! Please try again!");

        const userRoles = await this.roleService.getUserRoles(user.id);

        const accessToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },

            this.configService.getOrThrow("ACCESS_SECRET_TOKEN"),

            {
                expiresIn: "1h"
            }
        )

        const refreshToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },

            this.configService.getOrThrow("REFRESH_SECRET_TOKEN"),

            {
                expiresIn: "5h"
            }
        )
        
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

}
