import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
// import { SocketService } from 'src/socket/socket.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    // private readonly socketService: SocketService
  ) { }

  // // ✅ Hàm phụ: cập nhật trạng thái user
  // private async setUserOffline(userId?: number) {
  //   if (!userId) return;
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (user && user.online !== false) {
  //     user.online = false;
  //     const result = await this.userRepository.save(user);
  //     // Gửi socket event đến tất cả client
  //     this.socketService.emitToAll('user_online', result);
  //   }
  // }

  async use(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new UnauthorizedException('Token không hợp lệ hoặc không tồn tại.');
    }

    try {
      // ✅ Bước 1: Verify token
      const decoded = this.jwtService.verify(token);

      // ✅ Bước 2: Kiểm tra phiên trong Redis
      const sessionData = await this.redisService.getKey(`user:${decoded.id}:session`);

      // ❌ Không có session => đăng xuất
      if (!sessionData) {
        // await this.setUserOffline(decoded.id);
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc không tồn tại.');
      }

      const session = JSON.parse(sessionData);

      // ❌ Token không khớp => đăng nhập nơi khác
      if (session.token !== token) {
        // ❌ Không set offline vì user vẫn đang online nơi khác
        throw new UnauthorizedException('Tài khoản đã được đăng nhập nơi khác!');
      }

      // ❌ Token đúng nhưng session đã hết hạn
      if (Date.now() > session.expiresAt) {
        // await this.setUserOffline(decoded.id);
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
      }

      // ✅ Token và session hợp lệ
      req.user = decoded;
      next();
    } catch (err) {
      // ✅ Giải mã để lấy userId (nếu có)
      const decoded = this.jwtService.decode(token) as any;
      const userId = decoded?.id;

      // ❌ Nếu lỗi do token hết hạn (JWT), thì set offline
      if (err instanceof TokenExpiredError) {
        // await this.setUserOffline(userId);
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      // ❌ Nếu là lỗi đăng nhập nơi khác thì KHÔNG set offline
      if (
        err instanceof UnauthorizedException &&
        err.message === 'Tài khoản đã được đăng nhập nơi khác!'
      ) {
        throw err; // Không set offline
      }

      // ✅ Các lỗi khác → có thể set offline (tuỳ bạn cân nhắc)
      // await this.setUserOffline(userId);
      throw err;
    }
  }
}
