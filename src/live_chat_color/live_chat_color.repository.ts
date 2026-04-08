import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable()
export class LiveChatColorRepository extends BaseRepository<any> {
    constructor(dataSource: DataSource) {
        super(dataSource, 'live_chat_color', ["id"]);
    }
}