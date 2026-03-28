import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly usersService: UsersService
  ) { }

  @Post('create')
  async create(@Body() body: any) {
    this.kafkaClient.emit('app.events', {
      type: 'user.create',
      data: body,
    });
    return { message: 'User creation event emitted' };
  }


}
