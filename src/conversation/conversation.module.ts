import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { Label } from 'src/labels/entities/label.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { LiveMessage } from 'src/live_message/entities/live_message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, Label, LiveMessage])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
// export class ConversationModule {}
export class ConversationModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'conversation/get-all', method: RequestMethod.GET },
        { path: 'conversation/get-by-id/:id', method: RequestMethod.GET },
        { path: 'conversation/get-paging', method: RequestMethod.GET },
        { path: 'conversation/update-label', method: RequestMethod.POST },

      );
  }
}