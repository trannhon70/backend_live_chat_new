import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { DomainEvents } from 'src/kafka/kafka.events';
import { KafkaService } from 'src/kafka/kafka.service';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly kafkaService: KafkaService,
  ) { }

  @Post('create')
  async create(@Req() req: any, @Body() body: any) {
    const result = await this.kafkaService.send(DomainEvents.Friend_create, body);
    return {
      statusCode: 1,
      message: 'create friend successfully!',
      data: result
    };
  }

   @Get('get-all-by-id/:id')
  async getAllById(@Req() req: any ,@Param() param: any) {
    const data = await this.friendService.getAllById(req, param);
     return {
      statusCode: 1,
      message: 'getAllById friend success!',
      data: data,
    };
  }

  // @Get('get-all-friend-user')
  // async getAllFriendUser(@Req() req: any ) {
  //   const data = await this.friendService.getAllFriendUser(req);
  //    return {
  //     statusCode: 1,
  //     message: 'get all friend user success!',
  //     data: data,
  //   };
  // }

}
