import { Injectable } from '@nestjs/common';
import { CreateLiveChatCardDto } from './dto/create-live_chat_card.dto';
import { UpdateLiveChatCardDto } from './dto/update-live_chat_card.dto';
import { currentTimestamp } from 'utils/currentTimestamp';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LiveChatCard } from './entities/live_chat_card.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LiveChatCardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(LiveChatCard)
    private readonly LiveChatCardRepository: Repository<LiveChatCard>,

    private readonly jwtService: JwtService, // Inject JwtService
    private readonly redisService: RedisService,
  ) { }
  async create(user_id: number, body: any) {
    try {
      
      const id = body.id || null

      const check = await this.LiveChatCardRepository.findOneBy({ user_id  });
      if (check) {
        const update = await this.LiveChatCardRepository.update({ id }, { name: body.name });
        return update
      } else {
        const newEntry = this.LiveChatCardRepository.create({
          ...body,
          user_id,
          created_at: currentTimestamp(),
        });
        await this.LiveChatCardRepository.save(newEntry);
      }

    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getByIdUser (user_id:number) {
    try {
      const result = await this.LiveChatCardRepository.findOne({where: {user_id}});
      return result
      
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
