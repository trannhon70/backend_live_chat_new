import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateLiveChatCardDto } from './dto/create-live_chat_card.dto';
import { LiveChatCardService } from './live_chat_card.service';

@Controller('live-chat-card')
export class LiveChatCardController {
  constructor(private readonly liveChatCardService: LiveChatCardService) {}

  @Post('create')
  async create(@Req() req:any, @Body() body: any) {
    const data = await this.liveChatCardService.create(req.user.id, body);
     return {
       statusCode: 1,
       message: 'Tạo thành công!',
       data: data,
     };
  }

  @Get('get-by-id-user')
   async getByIdUser(@Req() req: any, @Body() body: any) {
     const data = await this.liveChatCardService.getByIdUser(req.user.id);
     return {
       statusCode: 1,
       message: 'get card successfuly!',
       data: data,
     };
   }
 
}
