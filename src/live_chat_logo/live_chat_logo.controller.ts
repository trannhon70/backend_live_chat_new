import { Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientInfo } from 'src/common/checkIp';
import { fileUploadInterceptor } from 'utils/file-upload.util';
import { LiveChatLogoService } from './live_chat_logo.service';

@Controller('live-chat-logo')
export class LiveChatLogoController {
  constructor(private readonly liveChatLogoService: LiveChatLogoService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('file', fileUploadInterceptor('./uploads')))
  async create(@Req() req: any, @Body() body: any, @UploadedFile() file: Express.Multer.File,) {
    const data = await this.liveChatLogoService.create(req, file.filename, body);
    return {
      statusCode: 1,
      message: 'Tạo chat bot logo thành công!',
      data: data,
    };
  }

  @Get('get-one')
  async getOne(@Req() req: any) {
    const data = await this.liveChatLogoService.getOne(req);
    return {
      statusCode: 1,
      message: 'Lấy danh sách thành công!',
      data: data,
    };
  }
}
