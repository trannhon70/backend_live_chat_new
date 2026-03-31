// users/users.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DomainEvents } from 'src/kafka/kafka.events';
import { Repository } from 'typeorm';
import { currentTimestamp } from 'utils/currentTimestamp';
import { User } from './entities/user.entity';
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
            throw error;
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
            throw error;
        }
    }

    @EventPattern(DomainEvents.User_close_the_lock)
    async handleUserCloseTheLock(@Payload() payload: any) {
        try {
            if (payload.id) {
                const result = await this.usersRepoConfig.update(payload.id, { is_deleted: payload.is_deleted });
                return result
            }
        } catch (error) {
            this.logger.error('Failed to process user created event', error);
            throw error;
        }
    }
}