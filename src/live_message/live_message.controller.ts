import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { LiveMessageService } from './live_message.service';
import { CreateLiveMessageDto } from './dto/create-live_message.dto';
import { UpdateLiveMessageDto } from './dto/update-live_message.dto';

@Controller('live-message')
export class LiveMessageController {
  constructor(private readonly liveMessageService: LiveMessageService) { }

  @Get('get-paging')
  async getPaging(@Req() req: any, @Query() query: any) {
    const data = await this.liveMessageService.getPaging(req, query);
    return {
      statusCode: 1,
      message: 'get paging live message success!',
      data: data,
    };
  }
}
