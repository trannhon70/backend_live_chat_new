import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RedisModule } from './redis/redis.module';
import { CustomJwtModule } from './common/auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { KafkaModule } from './kafka/kafka.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LabelsModule } from './labels/labels.module';
import { BlockIpModule } from './block_ip/block_ip.module';
import { LiveChatColorModule } from './live_chat_color/live_chat_color.module';
import { LiveChatLogoModule } from './live_chat_logo/live_chat_logo.module';
import { LiveChatCardModule } from './live_chat_card/live_chat_card.module';
import { LiveChatRandomMessageModule } from './live_chat_random_message/live_chat_random_message.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // cực kỳ quan trọng
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        // logging: true,
        extra: {
          max: 10, // max connections
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Thư mục chứa file tĩnh
      serveRoot: '/api/uploads',               // Đường dẫn để truy cập
    }),
    SocketModule,
    CustomJwtModule,
    RedisModule,
    KafkaModule,
    UsersModule,
    RolesModule,
    LabelsModule,
    BlockIpModule,
    LiveChatColorModule,
    LiveChatLogoModule,
    LiveChatCardModule,
    LiveChatRandomMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
