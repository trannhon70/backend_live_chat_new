import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly usersService: UsersService
  ) { }

  @Post('create')
  async create(@Body() body: any) {
    this.kafkaService.publishUserCreated(body);
    return { message: 'User creation event emitted' };
  }


}
