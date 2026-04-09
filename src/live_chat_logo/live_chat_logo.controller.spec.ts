import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatLogoController } from './live_chat_logo.controller';
import { LiveChatLogoService } from './live_chat_logo.service';

describe('LiveChatLogoController', () => {
  let controller: LiveChatLogoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveChatLogoController],
      providers: [LiveChatLogoService],
    }).compile();

    controller = module.get<LiveChatLogoController>(LiveChatLogoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
