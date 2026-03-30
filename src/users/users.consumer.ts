// users/users.consumer.ts
import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DomainEvents } from 'src/kafka/kafka.events';
import { currentTimestamp } from 'utils/currentTimestamp';
import * as bcrypt from 'bcryptjs';

let saltOrRounds = 10;
@Controller()
export class UsersConsumer {
    private readonly logger = new Logger(UsersConsumer.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    @EventPattern(DomainEvents.UserCreated)
    async handleUserCreated(@Payload() body: any) {
        try {
            const users = await this.userRepo.find();
            const hashPassword = await bcrypt.hash(body.password, saltOrRounds)
            const data: any = {
                roleId: body.roleId || '',
                email: body.email || '',
                password: hashPassword || '',
                fullName: body.fullName || '',
                ngaySinh: body.ngaySinh || '',
                phone: body.phone || '',
                quantity: body.quantity || 0,
                order: users.length + 1 || 0,
                created_at: currentTimestamp(),
            }
            return await this.userRepo.save(data)
        } catch (error) {
            this.logger.error('Failed to process user created event', error);
        }
    }
}