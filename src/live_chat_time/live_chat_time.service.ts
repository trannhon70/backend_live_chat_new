import { Injectable, Logger } from '@nestjs/common';
import { CreateLiveChatTimeDto } from './dto/create-live_chat_time.dto';
import { UpdateLiveChatTimeDto } from './dto/update-live_chat_time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveChatTimeRepository } from './live_chat_time.repository'
import { currentTimestamp } from 'utils/currentTimestamp';
import { LiveChatTime } from './entities/live_chat_time.entity';

@Injectable()
export class LiveChatTimeService {
  private readonly logger = new Logger(LiveChatTimeService.name);
  constructor(
    private readonly liveChatTimeRepository: LiveChatTimeRepository,
    @InjectRepository(LiveChatTime)
    private readonly liveChatTime: Repository<LiveChatTime>,
  ) { }
  async create(body: any) {
    try {
      const check = await this.liveChatTime.find();

      if (check.length === 0) {
        // chưa có dữ liệu -> insert
        await Promise.all(
          body.map(async (item: any) => {
            const dataRef = {
              time: item.time,
              created_at: currentTimestamp(),
            };
            return await this.liveChatTimeRepository.create(dataRef);
          })
        );
      } else {
        // đã có dữ liệu -> update
        await Promise.all(
          body.map(async (item: any) => {
            return await this.liveChatTimeRepository.update(
              item.id,
              { time: item.time }
            );
          })
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Failed to process user created event', error);
      throw error;
    }
  }


}
