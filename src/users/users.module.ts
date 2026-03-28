import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KafkaConsumer } from 'src/kafka/kafka.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, KafkaConsumer],
  providers: [UsersService],
})
export class UsersModule { }
