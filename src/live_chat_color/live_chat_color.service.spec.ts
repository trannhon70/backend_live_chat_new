import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatColorService } from './live_chat_color.service';

describe('LiveChatColorService', () => {
  let service: LiveChatColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveChatColorService],
    }).compile();

    service = module.get<LiveChatColorService>(LiveChatColorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
