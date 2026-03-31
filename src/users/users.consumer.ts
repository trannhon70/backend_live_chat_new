// users/users.consumer.ts
import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DomainEvents } from 'src/kafka/kafka.events';
import { currentTimestamp } from 'utils/currentTimestamp';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';

let saltOrRounds = 10;
@Controller()
export class UsersConsumer {
    private readonly logger = new Logger(UsersConsumer.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly usersRepoConfig: UsersRepository,
    ) { }

    @EventPattern(DomainEvents.UserCreated)
    async handleUserCreated(@Payload() body: any) {
        try {
            const users = await this.usersRepoConfig.findAll();

            const hashPassword = await bcrypt.hash(body.password, saltOrRounds)
            const data: any = {
                role_Id: body.role_Id || '',
                email: body.email || '',
                password: hashPassword || '',
                full_name: body.full_name || '',
                ngay_sinh: body.ngay_sinh || '',
                phone: body.phone || '',
                quantity: body.quantity || 0,
                sort_order: users.length + 1 || 0,
                created_at: currentTimestamp(),
            }
            return await this.usersRepoConfig.create(data)
        } catch (error) {
            this.logger.error('Failed to process user created event', error);
        }
    }

    @EventPattern(DomainEvents.User_update_profile)
    async handleUserUpdateProfile(@Payload() payload: any) {
        try {
            const body = {
                full_name: payload.full_name,
                ngay_sinh: payload.ngay_sinh,
                phone: payload.phone,
                avatar: payload.file ? `${process.env.URL_BACKEND}/api/uploads/${payload.file}` : null
            }
            return await this.usersRepoConfig.update(Number(payload.userId), body)
        } catch (error) {
            this.logger.error('Failed to process user created event', error);
        }
    }
}