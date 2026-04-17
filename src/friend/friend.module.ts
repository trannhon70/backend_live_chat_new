import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { FriendRepository } from './friend.repository';
import { FriendConsumer } from './friend.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User])],
  controllers: [FriendController, FriendConsumer],
  providers: [FriendService, FriendRepository],
})
// export class FriendModule {}
export class FriendModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'friend/create', method: RequestMethod.POST },
        { path: 'friend/get-all-by-id/:id', method: RequestMethod.GET },

      );

  }
}