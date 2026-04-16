import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LiveChatTimeService } from './live_chat_time.service';
import { LiveChatTimeController } from './live_chat_time.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveChatTime } from './entities/live_chat_time.entity';
import { LiveChatTimeRepository } from './live_chat_time.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LiveChatTime])],
  controllers: [LiveChatTimeController],
  providers: [LiveChatTimeService, LiveChatTimeRepository],
})
// export class LiveChatTimeModule {}
export class LiveChatTimeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'live-chat-time/create', method: RequestMethod.POST },
       
      );
  }
}