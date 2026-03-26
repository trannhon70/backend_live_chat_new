import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable()
export class RoleRepository extends BaseRepository<any> {
    constructor(dataSource: DataSource) {
        super(dataSource, 'role', ['id', 'name', 'created_at']);
    }
}