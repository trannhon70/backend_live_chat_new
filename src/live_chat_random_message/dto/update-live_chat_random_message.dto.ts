import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveChatRandomMessageDto } from './create-live_chat_random_message.dto';

export class UpdateLiveChatRandomMessageDto extends PartialType(CreateLiveChatRandomMessageDto) {}
