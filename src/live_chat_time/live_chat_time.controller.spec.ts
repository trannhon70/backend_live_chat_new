import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatTimeController } from './live_chat_time.controller';
import { LiveChatTimeService } from './live_chat_time.service';

describe('LiveChatTimeController', () => {
  let controller: LiveChatTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveChatTimeController],
      providers: [LiveChatTimeService],
    }).compile();

    controller = module.get<LiveChatTimeController>(LiveChatTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
