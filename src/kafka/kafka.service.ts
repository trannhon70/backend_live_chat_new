import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
    constructor(
        @Inject('KAFKA_SERVICE')
        private readonly kafka: ClientKafka,
    ) { }

    async onModuleInit() {
        // 👇 bắt buộc phải subscribe trước khi connect
        this.kafka.subscribeToResponseOf('chat.send');
        await this.kafka.connect();
        console.log('✅ Kafka connected');
    }

    async sendMessage(data: any) {
        return this.kafka.emit('chat.send', data); // fire & forget
    }
}