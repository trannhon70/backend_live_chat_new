import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, Query, Put } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from './entities/label.entity';
import { Repository } from 'typeorm';
import { DomainEvents } from 'src/kafka/kafka.events';
import { currentTimestamp } from 'utils/currentTimestamp';


@Controller('labels')
export class LabelsController {
  constructor(
    private readonly labelsService: LabelsService,
    private readonly kafkaService: KafkaService,
    @InjectRepository(Label)
    private readonly labelRepo: Repository<Label>,
  ) { }

  @Post('create')
  async create(@Req() req: any, @Body() body: any) {
    const check = await this.labelRepo.findOne({ where: { name: body.name } });
    if (check) {
      throw new BadRequestException('Label đã được đăng ký, vui lòng đăng ký label khác!');
    }
    const payload = {
      name: body.name || null,
      color: body.color || null,
      user_id: req.user.id,
      created_at: currentTimestamp()
    }
    const result = await this.kafkaService.send(DomainEvents.Label_created, payload);

    return {
      statusCode: 1,
      message: 'create label successfully!',
      data: result
    };
  }

  @Get('get-paging')
  async getPaging(@Req() req: any, @Query() query: any) {
    const data = await this.labelsService.getPaging(req, query);
    return {
      statusCode: 1,
      message: 'get paging label success!',
      data: data
    };
  }

  @Delete('delete/:id')
  async delete(@Req() req: any, @Param() param: any) {
    const result = await this.kafkaService.send(DomainEvents.Label_delete, param);
    return {
      statusCode: 1,
      message: 'delete label successfully!',
      data: result
    };
  }

  @Get('get-by-id/:id')
  async getById(@Req() req: any, @Param() param: any) {
    const data = await this.labelsService.getById(req, param);
    return {
      statusCode: 1,
      message: 'get by id label success!',
      data: data
    };
  }

  @Put('update/:id')
  async update(@Req() req: any, @Body() body: any, @Param() param: any) {
    const payload = {
      id: param.id,
      ...body
    }
    const result = await this.kafkaService.send(DomainEvents.Label_update, payload);
    return {
      statusCode: 1,
      message: 'update user successfully!',
      data: result
    };
  }
}
