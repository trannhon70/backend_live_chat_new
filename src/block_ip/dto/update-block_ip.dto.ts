import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockIpDto } from './create-block_ip.dto';

export class UpdateBlockIpDto extends PartialType(CreateBlockIpDto) {}
