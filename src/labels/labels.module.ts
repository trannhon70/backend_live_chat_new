import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Label } from './entities/label.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { RoleMiddleware } from 'src/common/middleware/role.middleware';
import { CheckRoles } from 'utils';
import { LabelsRepository } from './labels.repository';
import { LabelsConsumer } from './labels.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Label, User])],
  controllers: [LabelsController, LabelsConsumer],
  providers: [LabelsService, LabelsRepository],
})
// export class LabelsModule { } sadsa
export class LabelsModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN]))
      .forRoutes(
        { path: 'labels/create', method: RequestMethod.POST },
        { path: 'labels/delete/:id', method: RequestMethod.DELETE },
        { path: 'labels/update/:id', method: RequestMethod.PUT },

      );

  }
}