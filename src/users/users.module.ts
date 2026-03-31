import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { UsersConsumer } from './users.consumer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { RoleMiddleware } from 'src/common/middleware/role.middleware';
import { CheckRoles } from 'utils';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [UsersController, UsersConsumer],
  providers: [UsersService, UsersRepository],
})

export class UsersModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN]))
      .forRoutes(
        { path: 'users/create', method: RequestMethod.POST },
        { path: 'users/get-paging', method: RequestMethod.GET },
      );
    consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes(
        { path: 'users/get-by-id-user', method: RequestMethod.GET },
        { path: 'users/update-profile', method: RequestMethod.POST },
      );
  }
}
