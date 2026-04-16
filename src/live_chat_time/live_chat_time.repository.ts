import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable()
export class LiveChatTimeRepository extends BaseRepository<any> {
    constructor(dataSource: DataSource) {
        super(dataSource, 'live_chat_time', ["id"]);
    }
}