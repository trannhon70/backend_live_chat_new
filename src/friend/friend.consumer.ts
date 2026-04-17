
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DomainEvents } from 'src/kafka/kafka.events';
import { FriendRepository } from './friend.repository';
import { currentTimestamp } from 'utils/currentTimestamp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';


@Controller()
export class FriendConsumer {
    private readonly logger = new Logger(FriendConsumer.name);
    constructor(
        @InjectRepository(Friend)
        private readonly Friend: Repository<Friend>,
        private readonly friendRepository: FriendRepository,
    ) { }

    @MessagePattern(DomainEvents.Friend_create)
    async handleFriendCreated(@Payload() payload: any) {
        try {
            const { userId, friend } = payload
            await this.Friend.delete({ user_id: userId })
            // Tạo danh sách các promise
            const promises = friend.map(async (item: any) => {
                const dataRef = {
                    user_id: userId,
                    friend_id: item,
                    created_at: currentTimestamp(),
                };
                return await this.Friend.save(dataRef);
            });

            // Đợi tất cả các friend được tạo xong
            return await Promise.all(promises);

        } catch (error) {
            this.logger.error('Failed to process friend created event', error);
            throw error;
        }
    }


}