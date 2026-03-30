import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { UsersConsumer } from './users.consumer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [UsersController, UsersConsumer],
  providers: [UsersService],
})

export class UsersModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'users/create', method: RequestMethod.POST },


      );
  }
}
