import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelRepo: Repository<Label>,

    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly redisService: RedisService,
  ) { }
  async getPaging(req: any, query: any) {
    try {
      const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
      const search = query.search || "";
      const skip = (pageIndex - 1) * pageSize;
      let whereCondition = '';
      const parameters: any = {};

      if (search) {
        if (whereCondition) whereCondition += ' AND ';
        whereCondition += '(labels.name LIKE :search )';
        parameters.search = `%${search}%`;
      }

      const qb = this.labelRepo.createQueryBuilder('labels')
        .leftJoinAndSelect('labels.user', 'user')
        .skip(skip)
        .take(pageSize)
        .orderBy('labels.id', 'DESC');

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

  async getById(req: any, param: any) {
    try {
      if (param.id) {
        return await this.labelRepo.findOneById(param)
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }


}
