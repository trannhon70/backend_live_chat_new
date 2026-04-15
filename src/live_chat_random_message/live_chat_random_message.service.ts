import { Injectable, Logger } from '@nestjs/common';
import { CreateLiveChatRandomMessageDto } from './dto/create-live_chat_random_message.dto';
import { UpdateLiveChatRandomMessageDto } from './dto/update-live_chat_random_message.dto';
import { LiveChatRandomMessage } from './entities/live_chat_random_message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LiveChatRandomMessageRepository } from './live_chat_random_message.repository';
import { currentTimestamp } from 'utils/currentTimestamp';

@Injectable()
export class LiveChatRandomMessageService {
  private readonly logger = new Logger(LiveChatRandomMessageService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly LiveChatRandomMessageRepoConfig: LiveChatRandomMessageRepository,

   
  ) { }

  async create(user_id: number, body:any) {
   try {
    const data = {
        name: body.name,
        color: body.color,
        time: body.time,
        user_id,
        created_at: currentTimestamp()
      }
      return await this.LiveChatRandomMessageRepoConfig.create(data)
   } catch (error) {
     this.logger.error('Failed to process user created event', error);
      throw error;
   }
  }

 
}
