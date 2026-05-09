import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ClientInfo } from 'src/common/checkIp';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    // private readonly chatGatewayService: ChatGateway,
  ) { }

  @Get('get-all')
  async GetAll(@Req() req: any, @Query() query: any) {
    const data = await this.conversationService.GetAll(req, query);
    return {
      statusCode: 1,
      message: 'get all conversation success!',
      data: data,
    };
  }

  @Post('create-chat-client')
  async createChatClient(@Req() req: any, @Body() body: any, @ClientInfo() option: any) {
    const conversation = await this.conversationService.createChatClient(req, body, option);
    // this.chatGatewayService.server.emit('send_conversation', conversation);

    // Sau 3 giây, cập nhật userId = 1 và bắn socket lại
    // if (!conversation.userId && !conversation.bot && conversation.url) {
    //   setTimeout(async () => {
    //     try {
    //       const updated = await this.conversationService.updateConversation(req, conversation);
    //       this.chatGatewayService.server.emit('send_conversation', updated);
    //     } catch (err) {
    //       console.error('Update userId failed:', err);
    //     }
    //   }, 3000);
    // }

    return conversation;
  }
}
