import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Put } from '@nestjs/common';
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

   @Get('get-paging')
  async getPaging(@Req() req: any, @Query() query: any) {
    const data = await this.liveChatRandomMessageService.getPaging(req.user.id, query);
    return {
      statusCode: 1,
      message: 'Lấy danh sách thành công!',
      data: data,
    };
  }

  @Put('update/:id')
  async update(@Req() req: any, @Param() param: any, @Body() body: any) {
    const data = await this.liveChatRandomMessageService.update(req, param,body);
    return {
      statusCode: 1,
      message: 'Cập nhật danh sách thành công!',
      data: data,
    };
  }

  @Get('delete/:id')
  async delete(@Req() req: any, @Param() param: any) {
    const data = await this.liveChatRandomMessageService.delete(req, param);
    return {
      statusCode: 1,
      message: 'Xóa danh sách thành công!',
      data: data,
    };
  }

}
