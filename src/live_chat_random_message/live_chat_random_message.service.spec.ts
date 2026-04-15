import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatRandomMessageService } from './live_chat_random_message.service';

describe('LiveChatRandomMessageService', () => {
  let service: LiveChatRandomMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveChatRandomMessageService],
    }).compile();

    service = module.get<LiveChatRandomMessageService>(LiveChatRandomMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
