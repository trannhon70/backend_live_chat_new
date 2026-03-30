import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaConstants } from './kafka.constants';


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

    publish(topic: string, data: any) {
        this.kafkaClient.emit(topic, data);
    }
}