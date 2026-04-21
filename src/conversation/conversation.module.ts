import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { Label } from 'src/labels/entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, Label])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
