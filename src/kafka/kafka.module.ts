import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Global()
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['localhost:9092'],
                        clientId: 'app-service',
                    },
                    consumer: {
                        groupId: 'app-consumer-group',
                    },
                },
            },
        ]),
    ],
    providers: [KafkaService],
    exports: [ClientsModule], // ✅ ĐÚNG
})
export class KafkaModule { }