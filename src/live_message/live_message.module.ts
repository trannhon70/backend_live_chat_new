import { Module } from '@nestjs/common';
import { LiveMessageService } from './live_message.service';
import { LiveMessageController } from './live_message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { LiveMessage } from './entities/live_message.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Conversation, User, LiveMessage])],
  controllers: [LiveMessageController],
  providers: [LiveMessageService],
})
export class LiveMessageModule {}
