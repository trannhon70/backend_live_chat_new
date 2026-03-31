import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEvents } from 'src/kafka/kafka.events';
import { KafkaService } from 'src/kafka/kafka.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ClientInfo } from 'src/common/checkIp';
import { SocketService } from 'src/socket/socket.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly usersService: UsersService,
    private readonly socketService: SocketService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  @Post('create')
  async create(@Body() body: any) {
    const check = await this.userRepo.findOne({ where: { email: body.email } });
    if (check) {
      throw new BadRequestException('Email đã được đăng ký, vui lòng đăng ký mail khác!');
    }
    this.kafkaService.publish(DomainEvents.UserCreated, body);
    return {
      statusCode: 1,
      message: 'create user success!',
    };
  }

  @Post('login')
  async login(@Body() body: any, @ClientInfo() ip: string) {
    const data = await this.usersService.login(body, ip);
    // await this.socketService.emitToAll('user_online', data.user);
    return {
      statusCode: 1,
      message: 'Đăng nhập thành công!',
      token: data.token,
      user: data.user,
      startTime: data.startTime,
      endTime: data.endTime
    };
  }

  @Get('get-by-id-user')
  async GetByIdUser(@Req() req: any) {
    const data = await this.usersService.GetByIdUser(req.user.id);
    return {
      statusCode: 1,
      message: 'get by id user success!',
      data: data
    };
  }

}
