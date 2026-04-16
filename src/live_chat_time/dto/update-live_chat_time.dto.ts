import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveChatTimeDto } from './create-live_chat_time.dto';

export class UpdateLiveChatTimeDto extends PartialType(CreateLiveChatTimeDto) {}
