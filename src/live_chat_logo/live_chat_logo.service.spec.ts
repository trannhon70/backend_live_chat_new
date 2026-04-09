import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatLogoService } from './live_chat_logo.service';

describe('LiveChatLogoService', () => {
  let service: LiveChatLogoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveChatLogoService],
    }).compile();

    service = module.get<LiveChatLogoService>(LiveChatLogoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
