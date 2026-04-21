import { Test, TestingModule } from '@nestjs/testing';
import { LiveMessageService } from './live_message.service';

describe('LiveMessageService', () => {
  let service: LiveMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveMessageService],
    }).compile();

    service = module.get<LiveMessageService>(LiveMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
