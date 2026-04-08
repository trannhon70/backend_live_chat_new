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
    async handleLiveChatColorCreated(@Payload() payload: any) {
        try {
            return await this.liveChatColorRepoConfig.create(payload);

        } catch (error) {
            this.logger.error('Failed to process live chat color created event', error);
            throw error;
        }
    }

    @MessagePattern(DomainEvents.LiveChatColor_update)
    async handleLiveChatColorUpdate(@Payload() payload: any) {
        try {
            const { id, ...data } = payload
            return await this.liveChatColorRepoConfig.update(id, data);
        } catch (error) {
            this.logger.error('Failed to process live chat color update event', error);
            throw error;
        }
    }

    @MessagePattern(DomainEvents.LiveChatColor_delete)
    async handleLiveChatColorDelete(@Payload() payload: any) {
        try {
            return await this.liveChatColorRepoConfig.delete(payload.id);
        } catch (error) {
            this.logger.error('Failed to process live chat color delete event', error);
            throw error;
        }
    }

}