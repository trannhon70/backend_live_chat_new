import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { LiveChatRandomMessageService } from './live_chat_random_message.service';


@Controller('live-chat-random-message')
export class LiveChatRandomMessageController {
  constructor(private readonly liveChatRandomMessageService: LiveChatRandomMessageService) {}

  @Post('create')
  async create(@Req() req:any ,@Body() body: any) {
    const data = await this.liveChatRandomMessageService.create(req.user.id,body);
    return {
      statusCode: 1,
      message: 'Tạo message thành công!',
      data: data,
    };
  }

}
