import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { RedisService } from 'src/redis/redis.service';
import { DataSource, Repository } from 'typeorm';
import { expirationTime } from 'utils';
import { currentTimestamp } from 'utils/currentTimestamp';
import { User } from './entities/user.entity';
let saltOrRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly redisService: RedisService,
  ) { }
  async login(body: any, ip: string) {

    const user = await this.userRepo.findOne({
      where: {
        email: body.email
      },
      relations: ['role'], // Liên kết với bảng Roles
    });

    if (!user) {
      throw new BadRequestException('Email không tồn tại!');
    }
    if (user.is_deleted === false) {
      throw new BadRequestException('Tài khoản này đã bị xóa!');
    }

    const isMatch = await bcrypt.compare(String(body.password), String(user.password));

    if (!isMatch) {
      throw new BadRequestException('Password không đúng');
    }

    // Kiểm tra Redis xem có phiên đăng nhập nào chưa
    const currentSession = await this.redisService.getKey(`user:${user.id}:session`);

    if (currentSession) {
      // Hủy token cũ
      await this.redisService.delKey(`user:${user.id}:session`);
    }
    const payload = {
      email: user.email,
      id: user.id,
      fullName: user.full_name,
      role: user.role,
    };

    const sessionToken = this.jwtService.sign(payload);

    // Lưu token mới vào Redis với thời gian hết hạn

    const sessionData = {
      token: sessionToken,
      expiresAt: Date.now() + expirationTime,
    };

    await this.redisService.setKey(`user:${user.id}:session`, JSON.stringify(sessionData), Math.floor(expirationTime / 1000));

    // ✅ Cập nhật trạng thái online
    user.is_online = true;
    await this.userRepo.save(user);

    return {
      token: sessionToken,
      user: {
        email: user.email,
        id: user.id,
        full_name: user.full_name,
        created_at: user.created_at,
        role: user.role,
        is_online: user.is_online,
        avatar: user.avatar,
        quantity: user.quantity
      },
      startTime: currentTimestamp(),
      endTime: currentTimestamp() + Math.floor(expirationTime / 1000)
    }
  }

  async GetByIdUser(userId: number) {
    const user = await this.dataSource.query(`
      SELECT 
        (to_jsonb(u) - 'password') || jsonb_build_object(
          'role', to_jsonb(r)
        ) AS user
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
      LIMIT 1
    `, [userId]);

    if (!user.length) {
      throw new Error('User not found');
    }

    return user[0].user;
  }


}
