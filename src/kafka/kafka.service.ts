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
        this.kafka.subscribeToResponseOf('app.events');
        await this.kafka.connect();
        console.log('✅ Kafka connected');
    }
    // emit → dùng cho @EventPattern
    // send → dùng cho @MessagePattern
    async sendMessage(data: any) {
        return this.kafka.emit('app.events', data); // fire & forget
    }
}