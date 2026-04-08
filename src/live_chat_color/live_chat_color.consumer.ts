import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEvents } from 'src/kafka/kafka.events';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LiveChatColorRepository } from './live_chat_color.repository';


@Controller()
export class LiveChatColorConsumer {
    private readonly logger = new Logger(LiveChatColorConsumer.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly liveChatColorRepoConfig: LiveChatColorRepository,
    ) { }

    @MessagePattern(DomainEvents.LiveChatColor_create)
    async handleLabelCreated(@Payload() payload: any) {
        try {
            return await this.liveChatColorRepoConfig.create(payload);

        } catch (error) {
            this.logger.error('Failed to process live chat color created event', error);
            throw error;
        }
    }





}