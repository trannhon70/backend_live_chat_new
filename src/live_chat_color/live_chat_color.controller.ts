import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEvents } from 'src/kafka/kafka.events';
import { KafkaService } from 'src/kafka/kafka.service';
import { Repository } from 'typeorm';
import { currentTimestamp } from 'utils/currentTimestamp';
import { LiveChatColor } from './entities/live_chat_color.entity';
import { LiveChatColorService } from './live_chat_color.service';

@Controller('live-chat-color')
export class LiveChatColorController {
  constructor(
    private readonly liveChatColorService: LiveChatColorService,
    private readonly kafkaService: KafkaService,
    @InjectRepository(LiveChatColor)
    private readonly liveChatColorRepo: Repository<LiveChatColor>,
  ) { }

  @Post('create')
  async create(@Req() req: any, @Body() body: any) {
    const check = await this.liveChatColorRepo.findOne({ where: { url: body.url?.trim() } });
    if (check) {
      throw new BadRequestException('Url đã được đăng ký, vui lòng đăng ký Url khác!');
    }
    const payload = {
      url: body.url || null,
      color: body.color || null,
      user_id: req.user.id,
      created_at: currentTimestamp()
    }
    const result = await this.kafkaService.send(DomainEvents.LiveChatColor_create, payload);

    return {
      statusCode: 1,
      message: 'create label successfully!',
      data: result
    };
  }

  @Get('get-paging')
  async getPaging(@Req() req: any, @Query() query: any) {
    const data = await this.liveChatColorService.getPaging(req, query);
    return {
      statusCode: 1,
      message: 'get paging live chat color success!',
      data: data
    };
  }

  @Post('update')
  async update(@Req() req: any, @Body() body: any) {
    const result = await this.kafkaService.send(DomainEvents.LiveChatColor_update, body);
    return {
      statusCode: 1,
      message: 'cập nhật chat bot tiêu đề thành công!',
      data: result,
    };
  }

  @Delete('delete/:id')
  async delete(@Req() req: any, @Param() param: any) {
    const result = await this.kafkaService.send(DomainEvents.LiveChatColor_delete, param);
    return {
      statusCode: 1,
      message: 'delete live chat color success!',
      data: result
    };
  }
}
