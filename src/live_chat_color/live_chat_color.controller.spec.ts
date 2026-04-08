import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatColorController } from './live_chat_color.controller';
import { LiveChatColorService } from './live_chat_color.service';

describe('LiveChatColorController', () => {
  let controller: LiveChatColorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveChatColorController],
      providers: [LiveChatColorService],
    }).compile();

    controller = module.get<LiveChatColorController>(LiveChatColorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
