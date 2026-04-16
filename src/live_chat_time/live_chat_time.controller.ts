import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveChatTimeService } from './live_chat_time.service';
import { CreateLiveChatTimeDto } from './dto/create-live_chat_time.dto';
import { UpdateLiveChatTimeDto } from './dto/update-live_chat_time.dto';

@Controller('live-chat-time')
export class LiveChatTimeController {
  constructor(private readonly liveChatTimeService: LiveChatTimeService) {}

  @Post('create')
  async create(@Body() body: any) {
    const result = await this.liveChatTimeService.create(body);
    return {
      statusCode: 1,
      message: 'create live chat time successfully!',
      data: result
    };
  }

 
}
