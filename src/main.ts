import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaConstants } from './kafka/kafka.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KafkaConstants.ClientId,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: KafkaConstants.ConsumerGroups.Default,
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  Logger.debug(
    `🚀 NestJS application with Kafka is running on ${process.env.PORT}`,
  );
  Logger.debug('📊 Kafdrop UI available at http://localhost:9000');
}
bootstrap();
