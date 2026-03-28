// src/redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),

    ],
    providers: [RedisService],
    exports: [RedisService], // Để có thể sử dụng RedisService ở các module khác
})
export class RedisModule { }