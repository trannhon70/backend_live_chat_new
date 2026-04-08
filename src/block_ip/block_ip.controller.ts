import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException } from '@nestjs/common';
import { BlockIpService } from './block_ip.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockIp } from './entities/block_ip.entity';
import { Repository } from 'typeorm';
import { currentTimestamp } from 'utils/currentTimestamp';
import { DomainEvents } from 'src/kafka/kafka.events';

@Controller('block-ip')
export class BlockIpController {
  constructor(
    private readonly blockIpService: BlockIpService,
    private readonly kafkaService: KafkaService,
    @InjectRepository(BlockIp)
    private readonly blockIpRepo: Repository<BlockIp>,
  ) { }

  @Post('create')
  async create(@Req() req: any, @Body() body: any) {
    const check = await this.blockIpRepo.findOne({ where: { name: body.name } });
    if (check) {
      throw new BadRequestException('Ip hoặc id đã tồn tại!');
    }
    const payload = {
      name: body.name || null,
      status: body.status || null,
      user_id: req.user.id,
      created_at: currentTimestamp()
    }
    const result = await this.kafkaService.send(DomainEvents.BlockIp_create, payload);
    return {
      statusCode: 1,
      message: 'create block ip successfully!',
      data: result
    };
  }


}
