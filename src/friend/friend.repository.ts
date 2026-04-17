import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable()
export class FriendRepository extends BaseRepository<any> {
    constructor(dataSource: DataSource) {
        super(dataSource, 'friend', ["id"]);
    }
}