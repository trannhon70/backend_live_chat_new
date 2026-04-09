import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LiveChatLogoService } from './live_chat_logo.service';
import { LiveChatLogoController } from './live_chat_logo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveChatLogo } from './entities/live_chat_logo.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([LiveChatLogo])],
  controllers: [LiveChatLogoController],
  providers: [LiveChatLogoService],
})
// export class LiveChatLogoModule { }
export class LiveChatLogoModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'live-chat-logo/create', method: RequestMethod.POST },

      );

  }
}