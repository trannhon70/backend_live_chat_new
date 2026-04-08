import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveChatColorDto } from './create-live_chat_color.dto';

export class UpdateLiveChatColorDto extends PartialType(CreateLiveChatColorDto) {}
