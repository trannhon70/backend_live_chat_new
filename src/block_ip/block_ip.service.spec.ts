import { Test, TestingModule } from '@nestjs/testing';
import { BlockIpService } from './block_ip.service';

describe('BlockIpService', () => {
  let service: BlockIpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockIpService],
    }).compile();

    service = module.get<BlockIpService>(BlockIpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
