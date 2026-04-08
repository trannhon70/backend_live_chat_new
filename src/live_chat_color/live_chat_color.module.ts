import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { User } from 'src/users/entities/user.entity';
import { LiveChatColor } from './entities/live_chat_color.entity';
import { LiveChatColorConsumer } from './live_chat_color.consumer';
import { LiveChatColorController } from './live_chat_color.controller';
import { LiveChatColorRepository } from './live_chat_color.repository';
import { LiveChatColorService } from './live_chat_color.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveChatColor, User])],
  controllers: [LiveChatColorController, LiveChatColorConsumer],
  providers: [LiveChatColorService, LiveChatColorRepository],
})
// export class LiveChatColorModule { }
export class LiveChatColorModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'live-chat-color/create', method: RequestMethod.POST },
        { path: 'live-chat-color/update', method: RequestMethod.POST },
        { path: 'live-chat-color/delete/:id', method: RequestMethod.DELETE },
      );

  }
}