import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateUserDTO, UpdateUserDTO } from '../dtos';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private authService: AuthService,
        private ConfigService: ConfigService
    ) {}

    async getAllUsers(options: IPaginationOptions, query?: string): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (query) queryBuilder.where('LOWER(user.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<User>(queryBuilder, options);
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found! Please try again!');

        return user;
    }

    async createUser(createData: CreateUserDTO) {
        const user = await this.userRepository.findOne({ where: { email: createData.email } });
        if (user) throw new BadRequestException('User already exists! Please try again!');

        const newUser = this.userRepository.create(createData);

        const hashedPassword = this.authService.hashPassword(createData.password);  
        newUser.password = hashedPassword;

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

}
