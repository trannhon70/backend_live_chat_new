// users/users.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEvents } from 'src/kafka/kafka.events';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LabelsRepository } from './labels.repository';


@Controller()
export class LabelsConsumer {
    private readonly logger = new Logger(LabelsConsumer.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly labelsRepoConfig: LabelsRepository,
    ) { }

    @MessagePattern(DomainEvents.Label_created)
    async handleLabelCreated(@Payload() payload: any) {
        try {
            return await this.labelsRepoConfig.create(payload);

        } catch (error) {
            this.logger.error('Failed to process label created event', error);
            throw error;
        }
    }

    @MessagePattern(DomainEvents.Label_delete)
    async handleLabelDelete(@Payload() payload: any) {
        try {
            return await this.labelsRepoConfig.delete(payload.id);
        } catch (error) {
            this.logger.error('Failed to process label delete event', error);
            throw error;
        }
    }

    @MessagePattern(DomainEvents.Label_update)
    async handleLabelUpdate(@Payload() payload: any) {
        try {
            const { id, ...data } = payload;
            return await this.labelsRepoConfig.update(id, data);
        } catch (error) {
            this.logger.error('Failed to process label update event', error);
            throw error;
        }
    }


}