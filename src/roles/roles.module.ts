import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RoleRepository } from './role.repository';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { RoleMiddleware } from 'src/common/middleware/role.middleware';
import { CheckRoles } from 'utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]), // inject repository/entity
  ],
  providers: [RolesService, RoleRepository],
  controllers: [RolesController],
  exports: [RolesService],
})
// export class RolesModule { }
export class RolesModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN]))
      .forRoutes(
        { path: 'roles', method: RequestMethod.POST },
      );
    // consumer
    //   .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN, CheckRoles.TUVAN]))
    //   .forRoutes(
    //     { path: 'users/update', method: RequestMethod.POST }
    //   );
  }
}