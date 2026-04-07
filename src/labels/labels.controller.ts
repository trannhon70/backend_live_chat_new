import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req } from '@nestjs/common';
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


}
