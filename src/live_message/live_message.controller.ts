import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveMessageService } from './live_message.service';
import { CreateLiveMessageDto } from './dto/create-live_message.dto';
import { UpdateLiveMessageDto } from './dto/update-live_message.dto';

@Controller('live-message')
export class LiveMessageController {
  constructor(private readonly liveMessageService: LiveMessageService) {}

  @Post()
  create(@Body() createLiveMessageDto: CreateLiveMessageDto) {
    return this.liveMessageService.create(createLiveMessageDto);
  }

  @Get()
  findAll() {
    return this.liveMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLiveMessageDto: UpdateLiveMessageDto) {
    return this.liveMessageService.update(+id, updateLiveMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveMessageService.remove(+id);
  }
}
