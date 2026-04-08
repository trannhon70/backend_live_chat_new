import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BlockIpService } from './block_ip.service';
import { BlockIpController } from './block_ip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockIp } from './entities/block_ip.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { RoleMiddleware } from 'src/common/middleware/role.middleware';
import { CheckRoles } from 'utils';
import { BlockIpRepository } from './block_ip.repository';
import { BlockIpConsumer } from './block_ip.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([BlockIp, User])],
  controllers: [BlockIpController, BlockIpConsumer],
  providers: [BlockIpService, BlockIpRepository],
})
// export class BlockIpModule { }
export class BlockIpModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggerMiddleware, RoleMiddleware([CheckRoles.ADMIN]))
      .forRoutes(
        { path: 'block-ip/create', method: RequestMethod.POST },
        { path: 'block-ip/update/:id', method: RequestMethod.PUT },

      );

  }
}