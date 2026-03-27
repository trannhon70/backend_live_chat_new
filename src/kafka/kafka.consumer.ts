import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaConsumer {
    @EventPattern('chat.send') // 👈 topic
    handleMessage(@Payload() message: any) {
        console.log('📩 Received from Kafka:', message.value);

        // 👉 xử lý: lưu DB, emit socket...
    }
}