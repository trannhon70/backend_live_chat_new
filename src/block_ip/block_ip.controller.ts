import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, Query, Put } from '@nestjs/common';
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

  @Get('get-paging')
  async getPaging(@Req() req: any, @Query() query: any) {
    const data = await this.blockIpService.getPaging(req, query);
    return {
      statusCode: 1,
      message: 'get paging block ip success!',
      data: data
    };
  }

  @Get('get-by-id/:id')
  async getById(@Param() param: any) {
    const data = await this.blockIpService.getById(param);
    return {
      statusCode: 1,
      message: 'get by id block ip success!',
      data: data
    };
  }

  @Put('update/:id')
  async update(@Req() req: any, @Param() param: any, @Body() body: any) {
    const payload = {
      id: param.id,
      name: body.name || null,
      status: body.status || null,
    }
    const result = await this.kafkaService.send(DomainEvents.BlockIp_update, payload);
    return {
      statusCode: 1,
      message: 'update block ip success!',
      data: result
    };
  }

  @Delete('delete/:id')
  async delete(@Req() req: any, @Param() param: any) {
    const result = await this.kafkaService.send(DomainEvents.BlockIp_delete, param);
    return {
      statusCode: 1,
      message: 'delete block ip success!',
      data: result
    };
  }
}
