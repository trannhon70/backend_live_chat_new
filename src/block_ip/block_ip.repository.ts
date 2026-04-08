import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable()
export class BlockIpRepository extends BaseRepository<any> {
    constructor(dataSource: DataSource) {
        super(dataSource, 'block_ip', ["id"]);
    }
}