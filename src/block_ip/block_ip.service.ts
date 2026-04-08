import { Injectable } from '@nestjs/common';
import { CreateBlockIpDto } from './dto/create-block_ip.dto';
import { UpdateBlockIpDto } from './dto/update-block_ip.dto';

@Injectable()
export class BlockIpService {
  create(createBlockIpDto: CreateBlockIpDto) {
    return 'This action adds a new blockIp';
  }

  findAll() {
    return `This action returns all blockIp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blockIp`;
  }

  update(id: number, updateBlockIpDto: UpdateBlockIpDto) {
    return `This action updates a #${id} blockIp`;
  }

  remove(id: number) {
    return `This action removes a #${id} blockIp`;
  }
}
