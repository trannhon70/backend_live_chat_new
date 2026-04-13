import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatCardController } from './live_chat_card.controller';
import { LiveChatCardService } from './live_chat_card.service';

describe('LiveChatCardController', () => {
  let controller: LiveChatCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveChatCardController],
      providers: [LiveChatCardService],
    }).compile();

    controller = module.get<LiveChatCardController>(LiveChatCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
