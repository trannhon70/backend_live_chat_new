import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) { }

  async getAllById(req: any, param: any) {
    try {
      const result = await this.friendRepository.find({
        where: {
          user_id: param.id
        }
      })
      return result
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
