import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Between, In, Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { searchTimestampOneDay } from 'utils';
import { LiveMessage } from 'src/live_message/entities/live_message.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,

    @InjectRepository(Conversation)
    private readonly ConversationRepository: Repository<Conversation>,

    @InjectRepository(LiveMessage)
    private readonly LiveMessageRepository: Repository<LiveMessage>,
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

  async getAllFriendUser(user_id: number) {
    try {

      const { startTimestamp, endTimestamp } = searchTimestampOneDay();

      const user = await this.userRepository.findOne({ where: { id: user_id } });
      const friendList = await this.friendRepository.find({
        where: { user_id: user_id },
        relations: ['friend'],
      });

      // Lấy danh sách bạn bè đã xoá (flag is_deleted === true)
      const dataFriend = friendList
        .filter((item: any) => item.friend?.is_deleted === true)
        .map((item: any) => item.friend);

      const allUsers = [user, ...dataFriend].filter(Boolean); // loại bỏ null

      const allUserIds = allUsers.map((u) => u.id);

      // Lấy toàn bộ conversation liên quan đến userId trong danh sách
      const conversations = await this.ConversationRepository.find({
        where: {
          assignedUserId: In(allUserIds),
          is_online: true,
          created_at: Between(startTimestamp, endTimestamp)
        },
      });

      const conversationIds = conversations.map((c) => c.id);

      // Lấy toàn bộ message cho các conversationId
      const messages = await this.LiveMessageRepository.find({
        where: {
          conversation_id: In(conversationIds),
          senderType: 'customer',
        },
        order: { created_at: 'DESC' },
      });

      // Gom message theo conversationId
      const messageMap = new Map<number, any[]>();
      messages.forEach((msg) => {
        if (!messageMap.has(msg.conversation_id)) {
          messageMap.set(msg.conversation_id, []);
        }
        messageMap.get(msg.conversation_id)!.push(msg);
      });

      // Gộp message vào conversation
      const conversationWithMessages = conversations.map((con) => ({
        ...con,
        message: messageMap.get(con.id) || [],
      }));

      // Gom conversation theo userId
      const conversationByUserId = new Map<number, any[]>();
      conversationWithMessages.forEach((c: any) => {
        if (!conversationByUserId.has(c.userId)) {
          conversationByUserId.set(c.userId, []);
        }
        conversationByUserId.get(c.userId)!.push(c);
      });

      // Gán conversation vào từng user
      const result = allUsers.map((u) => ({
        ...u,
        conversation: conversationByUserId.get(u.id) || [],
      }));

      return {
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


}
