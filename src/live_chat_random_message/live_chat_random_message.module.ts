import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LiveChatRandomMessageService } from './live_chat_random_message.service';
import { LiveChatRandomMessageController } from './live_chat_random_message.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LiveChatRandomMessage } from './entities/live_chat_random_message.entity';
import { LiveChatRandomMessageRepository } from './live_chat_random_message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LiveChatRandomMessage, User])],
  controllers: [LiveChatRandomMessageController],
  providers: [LiveChatRandomMessageService, LiveChatRandomMessageRepository],
})
// export class LiveChatRandomMessageModule {}
export class LiveChatRandomMessageModule implements NestModule {
  
   configure(consumer: MiddlewareConsumer) {
       consumer
         .apply(AuthMiddleware, LoggerMiddleware) 
         .forRoutes( 
            { path: 'live-chat-random-message/create', method: RequestMethod.POST },
            { path: 'live-chat-random-message/get-paging', method: RequestMethod.GET },
            { path: 'live-chat-random-message/update/:id', method: RequestMethod.PUT },
            { path: 'live-chat-random-message/delete/:id', method: RequestMethod.DELETE },
           
       ); 
   }
  }