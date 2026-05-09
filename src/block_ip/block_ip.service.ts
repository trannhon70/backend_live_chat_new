import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockIpRepository } from './block_ip.repository';
import { BlockIp } from './entities/block_ip.entity';
import { LiveChatTime } from 'src/live_chat_time/entities/live_chat_time.entity';
import { RedisService } from 'src/redis/redis.service';
import { LiveChatLogo } from 'src/live_chat_logo/entities/live_chat_logo.entity';
import { LiveChatColor } from 'src/live_chat_color/entities/live_chat_color.entity';

@Injectable()
export class BlockIpService {
  constructor(
    @InjectRepository(BlockIp)
    private readonly blockIpRepo: Repository<BlockIp>,

    private readonly blockIpRepository: BlockIpRepository,

    @InjectRepository(LiveChatTime)
    private readonly liveChatTimeRepository: Repository<LiveChatTime>,

    @InjectRepository(LiveChatLogo)
    private readonly liveChatLogoRepository: Repository<LiveChatLogo>,

    @InjectRepository(LiveChatColor)
    private readonly liveChatColorRepository: Repository<LiveChatColor>,

    private readonly redisService: RedisService,
  ) { }

  async getPaging(req: any, query: any) {
    try {
      const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
      const search = query.search || "";
      const status = query.status || "";
      const skip = (pageIndex - 1) * pageSize;
      let whereCondition = '';
      const parameters: any = {};

      if (search) {
        if (whereCondition) whereCondition += ' AND ';
        whereCondition += '(block_ip.name LIKE :search)';
        parameters.search = `%${search}%`;
      }

      // Search theo status
      if (status) {
        if (whereCondition) whereCondition += ' AND ';
        whereCondition += `block_ip.status = :status`;
        parameters.status = status;
      }

      const qb = this.blockIpRepo.createQueryBuilder('block_ip')
        .skip(skip)
        .take(pageSize)
        .orderBy('block_ip.id', 'DESC');

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

  async getById(param: any) {
    try {
      if (param.id) {
        return await this.blockIpRepo.findOneById(param)
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getAll(req: any, query: any) {
    try {
      const cacheKey = `live_chat_config:${query.url}`;

      // 1️⃣ Kiểm tra cache trước
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        console.log("✅ Return from Redis");
        return cached
      }

      // 2️⃣ Nếu không có cache thì query DB
      const resultLogo = await this.liveChatLogoRepository.find({ take: 1 });

      const live_chat_color = await this.liveChatColorRepository.findOneBy({
        url: query.url,
      });

      const time_display_chat = await this.liveChatTimeRepository.find();
      const block_ip = await this.blockIpRepo.find();

      const response = {
        logo: resultLogo[0]?.file || null,
        time_display_chat,
        block_ip,
        live_chat_color,
      };

      // 3️⃣ Lưu vào Redis (ví dụ 8 tiếng)
      await this.redisService.set(cacheKey, JSON.stringify(response), 28800);

      return response;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
