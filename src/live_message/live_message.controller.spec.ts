import { Test, TestingModule } from '@nestjs/testing';
import { LiveMessageController } from './live_message.controller';
import { LiveMessageService } from './live_message.service';

describe('LiveMessageController', () => {
  let controller: LiveMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveMessageController],
      providers: [LiveMessageService],
    }).compile();

    controller = module.get<LiveMessageController>(LiveMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
