import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatTimeService } from './live_chat_time.service';

describe('LiveChatTimeService', () => {
  let service: LiveChatTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveChatTimeService],
    }).compile();

    service = module.get<LiveChatTimeService>(LiveChatTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
