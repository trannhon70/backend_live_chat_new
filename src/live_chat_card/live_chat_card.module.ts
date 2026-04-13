import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LiveChatCardService } from './live_chat_card.service';
import { LiveChatCardController } from './live_chat_card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveChatCard } from './entities/live_chat_card.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([LiveChatCard, User])],
  controllers: [LiveChatCardController],
  providers: [LiveChatCardService],
})
// export class LiveChatCardModule {}
export class LiveChatCardModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware )
      .forRoutes(
        { path: 'live-chat-card/create', method: RequestMethod.POST },
        { path: 'live-chat-card/get-by-id-user', method: RequestMethod.GET },
        

      );

  }
}
