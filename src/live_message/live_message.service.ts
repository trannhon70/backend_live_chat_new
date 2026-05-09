import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { LiveMessage } from './entities/live_message.entity';
import { searchTimestampOneDay } from 'utils';

@Injectable()
export class LiveMessageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,


    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(LiveMessage)
    private readonly LiveMessageRepository: Repository<LiveMessage>,


  ) { }
  async getPaging(req: any, query: any) {
    try {
      const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
      const conversation_id = query.conversationId;
      const skip = (pageIndex - 1) * pageSize;
      let whereCondition = '';
      const parameters: any = {};

      if (conversation_id !== undefined &&
        conversation_id !== null &&
        conversation_id !== 'null') {
        whereCondition += 'message.conversation_id = :conversation_id';
        parameters.conversation_id = conversation_id;
      }

      const qb = this.LiveMessageRepository.createQueryBuilder('message')
        .leftJoinAndSelect('message.user', 'user')
        .skip(skip)
        .take(pageSize)
        .orderBy('message.created_at', 'DESC');

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

  async getPagingMessageChatBoxCurrentDay(req: any, query: any) {
    try {

      const { startTimestamp, endTimestamp } = searchTimestampOneDay();
      const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
      const idComputer = query.idComputer;
      const gclid = query.gclid;
      const skip = (pageIndex - 1) * pageSize;
      let whereCondition = '';
      const parameters: any = {};

      let conversation = await this.conversationRepository.findOne({
        where: {
          idComputer: idComputer,
          gclid: gclid,
          created_at: Between(startTimestamp, endTimestamp),
        },
      });

      if (!conversation) {
        // Nếu không có conversation thì trả về rỗng
        return {
          data: [],
          total: 0,
          pageIndex,
          pageSize,
          totalPages: 0,
        };
      }

      const conversation_id = conversation.id
      const senderType = 'auto'

      if (conversation_id) {
        whereCondition += 'message.conversation_id = :conversation_id';
        parameters.conversation_id = conversation_id;
      }
      if (senderType) {
        if (whereCondition) whereCondition += ' AND ';
        whereCondition += 'message.senderType != :excludedSenderType';
        parameters.excludedSenderType = senderType;
      }

      const qb = this.LiveMessageRepository.createQueryBuilder('message')
        .skip(skip)
        .take(pageSize)
        .orderBy('message.created_at', 'DESC');

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
}
