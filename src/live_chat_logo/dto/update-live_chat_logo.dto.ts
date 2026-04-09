import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveChatLogoDto } from './create-live_chat_logo.dto';

export class UpdateLiveChatLogoDto extends PartialType(CreateLiveChatLogoDto) {}
