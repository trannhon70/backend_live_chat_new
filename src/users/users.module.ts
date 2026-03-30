import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { UsersConsumer } from './users.consumer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [UsersController, UsersConsumer],
  providers: [UsersService],
})
export class UsersModule { }
