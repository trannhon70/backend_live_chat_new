import { Injectable, Logger } from '@nestjs/common';
import { CreateLiveChatRandomMessageDto } from './dto/create-live_chat_random_message.dto';
import { UpdateLiveChatRandomMessageDto } from './dto/update-live_chat_random_message.dto';
import { LiveChatRandomMessage } from './entities/live_chat_random_message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { LiveChatRandomMessageRepository } from './live_chat_random_message.repository';
import { currentTimestamp } from 'utils/currentTimestamp';
import { CheckRoles, searchTimestampOneDay } from 'utils';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { LiveChatCard } from 'src/live_chat_card/entities/live_chat_card.entity';

@Injectable()
export class LiveChatRandomMessageService {
  private readonly logger = new Logger(LiveChatRandomMessageService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(LiveChatRandomMessage)
    private readonly liveChatRandomMessage: Repository<LiveChatRandomMessage>,

    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(LiveChatCard)
    private readonly liveChatCardRepository: Repository<LiveChatCard>,

    private readonly LiveChatRandomMessageRepoConfig: LiveChatRandomMessageRepository,


  ) { }

  async create(user_id: number, body: any) {
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
        return await this.LiveChatRandomMessageRepoConfig.update(param.id, { name: body.name, color: body.color, time: body.time })
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

  async getAllByUserId(req: any, query: any) {
    try {
      const idComputer = query.idComputer || null;
      const gclid = query.gclid || null;
      const { startTimestamp, endTimestamp } = searchTimestampOneDay();

      if (idComputer) {
        const [conversation, result] = await Promise.all([
          this.conversationRepository.findOne({
            where: { idComputer, gclid, created_at: Between(startTimestamp, endTimestamp) }
          }),

          this.liveChatRandomMessage.find({
            where: { user_id: CheckRoles.ADMIN },
            order: { created_at: 'ASC' }
          })
        ]);

        const chat_box_massage_doctor = await this.liveChatCardRepository.findOne({ where: { user_id: conversation?.assigned_user_id ? conversation?.assigned_user_id : CheckRoles.ADMIN } });
        return {
          message: result,
          card: chat_box_massage_doctor
        }
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

}
