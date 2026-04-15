import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatRandomMessageController } from './live_chat_random_message.controller';
import { LiveChatRandomMessageService } from './live_chat_random_message.service';

describe('LiveChatRandomMessageController', () => {
  let controller: LiveChatRandomMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveChatRandomMessageController],
      providers: [LiveChatRandomMessageService],
    }).compile();

    controller = module.get<LiveChatRandomMessageController>(LiveChatRandomMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
