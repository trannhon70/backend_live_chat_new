import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { currentTimestamp } from 'utils/currentTimestamp';
import { isKnownBot } from 'src/common/checkIPGoogle';
import { searchTimestampOneDay } from 'utils';
import { LiveMessage } from 'src/live_message/entities/live_message.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(LiveMessage)
    private readonly LiveMessageRepository: Repository<LiveMessage>,


    private readonly redisService: RedisService,
  ) { }

  async GetAll(req: any, query: any) {
    try {
      const { startTimestamp, endTimestamp } = searchTimestampOneDay();

      const page = query.page ? parseInt(query.page, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;

      // Lấy conversation theo ngày + phân trang
      const [conversations, total] = await this.conversationRepository.findAndCount({
        where: {
          created_at: Between(startTimestamp, endTimestamp),
        },
        order: { created_at: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      // Lấy lastMessage cho mỗi conversation
      const UpdateConversation = await Promise.all(
        conversations.map(async (item: any) => {
          const lastMessage = await this.LiveMessageRepository.find({
            where: {
              conversation_id: item.id,
              senderType: 'customer',
            },
            order: { created_at: 'DESC' },
          });

          return {
            ...item,
            message: lastMessage || null,
          };
        })
      );

      return {
        data: UpdateConversation,
        page,
        pageSize,
        total,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createChatClient(req: any, body: any, options: any) {
    try {
      const { startTimestamp, endTimestamp } = searchTimestampOneDay();
      const { ip, userAgent, browser, os, device, location } = options;
      const { idComputer, online, url, address, gclid } = body;
      const bot: string | null = await isKnownBot(ip, userAgent);
      let count = await this.conversationRepository.count({
        where: {
          created_at: Between(startTimestamp, endTimestamp),
        },
      });

      const namePrefix = location?.city ?? "Unknown";
      const nameSuffix = (count ?? 0) + 1;

      const dataRef: any = {
        customerIp: ip,
        idComputer,
        userAgent,
        browser,
        os,
        device,
        is_online: online,
        country: location?.country ?? null,
        region: location?.region ?? null,
        city: location?.city ?? null,
        name: `${namePrefix}-${nameSuffix}`,
        created_at: currentTimestamp(),
        url,
        address,
        gclid,
        bot,
      };

      // Tìm cuộc trò chuyện hiện có trong ngày
      let conversation: any = await this.conversationRepository.findOne({
        where: {
          idComputer,
          gclid,
          created_at: Between(startTimestamp, endTimestamp),
        },
      });

      if (!conversation) {
        // Nếu không có thì tạo mới
        conversation = await this.conversationRepository.save(dataRef);
        await this.redisService.set(`online:${conversation.id}`, conversation, 60);
        return conversation
      } else {
        // thực hiện check user đó có online không
        const user = conversation.assigned_user_id ? await this.userRepository.findOne({ where: { id: conversation.assigned_user_id } }) : null;

        if (!user?.is_online) {
          conversation.assigned_user_id = null;
          conversation.assignedUser = null;
          await this.conversationRepository.save(conversation);
        }
        // Nếu có thì cập nhật lại online = true
        conversation.is_online = true;
        await this.conversationRepository.save(conversation);
        await this.redisService.set(`online:${conversation.id}`, conversation, 60);
        return conversation;
      }


    } catch (error) {
      console.error('createChatClient error:', error);
      throw new Error('Failed to create chat client');
    }
  }
}
