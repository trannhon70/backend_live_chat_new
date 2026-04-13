import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveChatCardDto } from './create-live_chat_card.dto';

export class UpdateLiveChatCardDto extends PartialType(CreateLiveChatCardDto) {}
