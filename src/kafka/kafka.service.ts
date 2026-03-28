import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaConstants } from './kafka.constants';

export interface UserCreatedEvent {
    userId: string;
    email: string;
    name: string;
    createdAt: Date;
}

export enum DomainEvents {
    UserCreated = 'user.created',
}

@Injectable()
export class KafkaService implements OnModuleInit {
    private readonly logger = new Logger(KafkaService.name);

    constructor(
        @Inject(KafkaConstants.InjectionTokens.Client)
        private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        await this.kafkaClient.connect();
        this.logger.log('Kafka client connected');
    }

    publishUserCreated(event: any) {
        try {
            this.kafkaClient.emit(DomainEvents.UserCreated, event);
            this.logger.log(`Published user created event for user: ${event}`);
        } catch (error) {
            this.logger.error('Failed to publish user created event', error);
            throw error;
        }
    }
}