// users/users.consumer.ts
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller()
export class UsersConsumer {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    @EventPattern('app.events')
    async handleUserEvent(@Payload() message: any) {
        console.log('🔥 RECEIVED:', message);
    }
}