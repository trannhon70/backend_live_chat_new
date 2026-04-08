import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockIpRepository } from './block_ip.repository';
import { BlockIp } from './entities/block_ip.entity';

@Injectable()
export class BlockIpService {
  constructor(
    @InjectRepository(BlockIp)
    private readonly blockIpRepo: Repository<BlockIp>,

    private readonly blockIpRepository: BlockIpRepository,
  ) { }

  async getPaging(req: any, query: any) {
    try {
      const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
      const search = query.search || "";
      const status = query.status || "";
      const skip = (pageIndex - 1) * pageSize;
      let whereCondition = '';
      const parameters: any = {};

      if (search) {
        if (whereCondition) whereCondition += ' AND ';
        whereCondition += '(block_ip.name LIKE :search)';
        parameters.search = `%${search}%`;
      }

      // Search theo status
      if (status) {
        if (whereCondition) whereCondition += ' AND ';
        whereCondition += `block_ip.status = :status`;
        parameters.status = status;
      }

      const qb = this.blockIpRepo.createQueryBuilder('block_ip')
        .skip(skip)
        .take(pageSize)
        .orderBy('block_ip.id', 'DESC');

      if (whereCondition) {
        qb.where(whereCondition, parameters);
      }
      const [result, total] = await qb.getManyAndCount();
      return {
        data: result,
        total: total,
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize),

      };
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getById(param: any) {
    try {
      if (param.id) {
        return await this.blockIpRepo.findOneById(param)
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
