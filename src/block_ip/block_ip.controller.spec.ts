import { Test, TestingModule } from '@nestjs/testing';
import { BlockIpController } from './block_ip.controller';
import { BlockIpService } from './block_ip.service';

describe('BlockIpController', () => {
  let controller: BlockIpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockIpController],
      providers: [BlockIpService],
    }).compile();

    controller = module.get<BlockIpController>(BlockIpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
