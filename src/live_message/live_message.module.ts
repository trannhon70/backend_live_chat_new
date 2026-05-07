import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LiveMessageService } from './live_message.service';
import { LiveMessageController } from './live_message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { LiveMessage } from './entities/live_message.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, LiveMessage])],
  controllers: [LiveMessageController],
  providers: [LiveMessageService],
})
// export class LiveMessageModule {}
export class LiveMessageModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'message/get-by-id-conversation', method: RequestMethod.GET },

      );
  }
}