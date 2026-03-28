import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { currentTimestamp } from 'utils/currentTimestamp';

let saltOrRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }
  async create(body: any) {
    const check = await this.userRepo.findOne({ where: { email: body.email } });
    if (check) {
      throw new BadRequestException('Email đã được đăng ký, vui lòng đăng ký mail khác!');
    }
    const users = await this.userRepo.find();

    const hashPassword = await bcrypt.hash(body.password, saltOrRounds)
    const data: any = {
      roleId: body.roleId || '',
      email: body.email || '',
      password: hashPassword || '',
      fullName: body.fullName || '',
      ngaySinh: body.ngaySinh || '',
      phone: body.phone || '',
      quantity: body.quantity || 0,
      order: users.length + 1 || 0,
      created_at: currentTimestamp(),
    }
    return await this.userRepo.save(data)
  }

}
