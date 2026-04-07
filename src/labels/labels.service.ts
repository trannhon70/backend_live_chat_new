import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelsService {
  create(createLabelDto: CreateLabelDto) {
    return 'This action adds a new label';
  }


}
