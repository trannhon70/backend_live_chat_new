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

     @InjectRepository(LiveChatRandomMessage)
    private readonly liveChatRandomMessage: Repository<LiveChatRandomMessage>,

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

  async getPaging(user_id: number, query: any) {
    try {
      const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
      const skip = (pageIndex - 1) * pageSize;
      let whereCondition = '';
      const parameters: any = {};

      if (user_id) {
        whereCondition += 'message_random.user_id = :user_id';
        parameters.user_id = user_id;
      }
      const qb = this.liveChatRandomMessage.createQueryBuilder('message_random')
        .leftJoinAndSelect('message_random.user', 'user')
        .skip(skip)
        .take(pageSize)
        .orderBy('message_random.id', 'ASC');

      if (whereCondition) {
        qb.where(whereCondition, parameters);
      }
      const [result, total] = await qb.getManyAndCount();

      return {
        data: result,
        total: total,
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize),
      };

    } catch (error) {
      console.log(error);
      throw error
    }
  }
async update(req: any, param: any, body: any) {
    try {
      if (param.id) {
        return await this.LiveChatRandomMessageRepoConfig.update( param.id , { name: body.name, color: body.color, time: body.time })
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async delete(req: any, param: any) {
    try {
      if (param.id) {
        return await this.LiveChatRandomMessageRepoConfig.delete(param.id)
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
 
}
