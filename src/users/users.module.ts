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
      .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN, CheckRoles.TUVAN]))
      .forRoutes(
        { path: 'users/create', method: RequestMethod.POST },
      );
    // consumer
    //   .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN, CheckRoles.TUVAN]))
    //   .forRoutes(
    //     { path: 'users/update', method: RequestMethod.POST }
    //   );
  }
}
