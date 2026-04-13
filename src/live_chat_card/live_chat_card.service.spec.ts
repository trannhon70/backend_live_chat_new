import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatCardService } from './live_chat_card.service';

describe('LiveChatCardService', () => {
  let service: LiveChatCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveChatCardService],
    }).compile();

    service = module.get<LiveChatCardService>(LiveChatCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
