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
import UserRoleRepository from '../repositories/user-role.repository';
import  TenantRepository  from '../../tenant/repositories/tenant.repository';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private configService: ConfigService,
        private roleRepository: RoleRepository,
        private jwtService: JwtService,
        private roleService: RoleService,
        private userRoleRepository: UserRoleRepository,
        private tenantRepository: TenantRepository
    ) {}

    async getAllUsers(options: IPaginationOptions, tenantId: string, query?: string): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        queryBuilder.where('user.tenant.id = :tenantId', { tenantId });

        if (query) queryBuilder.andWhere('LOWER(user.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<User>(queryBuilder, options);
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userRoles.role']
        });
        if (!user) throw new NotFoundException('User not found! Please try again!');

        return user;
    }

    async createUser(createData: CreateUserDTO, tenantId: string) {
        const user = await this.userRepository.findOne({ where: { email: createData.email, tenant: { id: tenantId } } });
        if (user) throw new BadRequestException('Email already exists! Please try again!');

        const newUser = this.userRepository.create({
            ...createData,
            tenant: { id: tenantId }
        });

        const hashedPassword = this.authService.hashPassword(createData.password);  
        newUser.password = hashedPassword;

        const savedUser = await this.userRepository.save(newUser);

        const staffRole = await this.roleRepository.findOne({ where: { name: 'Staff', tenant: { id: tenantId } } }) as Role;
        const newUserRole = this.userRoleRepository.create({
            roleId: staffRole.id,
            userId: savedUser.id,
            tenant: { id: tenantId }
        });

        const savedUserRole = await this.userRoleRepository.save(newUserRole);

        savedUser.userRoles = [savedUserRole];

        return savedUser;
    }

    async updateUser(id: string, updateData: UpdateUserDTO, tenantId: string) {
        const user = await this.userRepository.findOne({ where: { id, tenant: { id: tenantId } } });
        if (!user) throw new NotFoundException('User not found! Please try again!');

        if (updateData.email) {
            const existedEmail = await this.userRepository.findOne({ where: { email: updateData.email, tenant: { id: tenantId } } });
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

    async addUserRole(roleId: string, userId: string, tenantId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId, tenant: { id: tenantId } } });
        const user = await this.userRepository.findOne({ where: { id: userId, tenant: { id: tenantId } }, relations: ['tenant'] });

        if (!role || !user) throw new NotFoundException("Role or User not found!");

        const newUserRole = this.userRoleRepository.create({
            roleId: role.id,
            userId: user.id,
            tenant: user.tenant
        });

        return await this.userRoleRepository.save(newUserRole);
    }

    async removeUserRole(roleId: string, userId: string, tenantId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId, tenant: { id: tenantId } } });
        const user = await this.userRepository.findOne({ where: { id: userId, tenant: { id: tenantId } } });

        if (!role || !user) throw new NotFoundException("Role or Usser not found!");

        return await this.userRoleRepository.delete({ roleId: role.id, userId: user.id, tenant: { id: tenantId } });
    }

    async signIn(payload: SignInPayload, tenantName: string) {
        const tenant = await this.tenantRepository.findOne({ where: { name: tenantName } });
        if (!tenant) throw new NotFoundException("Store not found! Please try again!");

        const user = await this.userRepository.findOne({ 
            where: { email: payload.email, tenant: { name: tenantName } }, 
            relations: ['userRoles', 'userRoles.role', 'tenant'] 
        });
        if (!user) throw new NotFoundException("Email not exist! Please try again!");

        const checkPassword = await this.authService.comparePassword(payload.password, user.password);
        if(!checkPassword) throw new BadRequestException("Password is incorrect! Please try again!");

        const userRoles = await this.roleService.getUserRoles(user.id);

        const accessToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles,
                tenant: user.tenant.id
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
                roles: userRoles,
                tenant: user.tenant.id
            },

            this.configService.getOrThrow("REFRESH_SECRET_TOKEN"),

            {
                expiresIn: "5h"
            }
        )
        
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    }

}
