import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<any> {
    constructor(dataSource: DataSource) {
        super(dataSource, 'users', ["id"]);
    }
}