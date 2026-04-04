import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
// import { Conversation } from 'src/conversation/entities/conversation.entity';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis;
    private readonly subscriber: Redis; // Thêm dòng này

    constructor(
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // @InjectRepository(Conversation)
        // private readonly conversationRepository: Repository<Conversation>,
    ) {

        // Redis chính để get/set
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'app_redis',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            db: 0,
        });

        // Redis riêng cho subscriber
        this.subscriber = new Redis({
            host: process.env.REDIS_HOST || 'app_redis',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            db: 0,
        });

        this.redis.on('connect', () => {
            console.log('✅ Đã kết nối Redis chính');
        });

        this.redis.on('error', (error) => {
            console.error('❌ Redis error:', error);
        });

        this.subscriber.on('connect', () => {
            console.log('✅ Đã kết nối Redis subscriber');
        });

        this.subscriber.on('error', (error) => {
            console.error('❌ Redis subscriber error:', error);
        });

        this.initKeyspaceListener();
    }

    private initKeyspaceListener() {
        this.subscriber.subscribe('__keyevent@0__:expired', (err, count) => {
            if (err) {
                console.error('❌ Redis subscribe lỗi:', err);
            } else {
                console.log(`📡 Redis subscribe success: ${count} channels`);
            }
        });

        this.subscriber.on('message', async (channel, key) => {
            if (channel !== '__keyevent@0__:expired') return;

            try {
                // const userMatch = key.match(/^user:(\d+):session$/);


                // if (userMatch) {
                //   const userId = parseInt(userMatch[1], 10);
                //   console.log(`🔒 Session expired for user ${userId}`);
                //   await this.userRepository.update({ id: userId }, { online: false });
                // }


            } catch (error) {
                console.error(`❌ Error handling Redis key expiration: ${key}`, error);
            }
        });
    }

    async setKey(key: string, value: any, ttlInSeconds: number) {
        await this.redis.set(key, value, 'EX', ttlInSeconds);
    }

    async getKey(key: string) {
        return await this.redis.get(key);
    }

    async getall(key: string) {
        return await this.redis.keys(key);
    }

    async delKey(key: string) {
        await this.redis.del(key);
    }

    //Xóa nhiều key cùng lúc dựa vào wildcard pattern (*).
    async delPattern(pattern: string): Promise<void> {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
            console.log(`🗑️ Xóa cache: ${keys.length} keys match ${pattern}`);
        }
    }



    async getAllUserSessions(): Promise<Record<string, any>> {
        const keys = await this.redis.keys('user:*:session');
        const result: Record<string, any> = {};

        for (const key of keys) {
            const value = await this.redis.get(key);
            if (value) {
                try {
                    result[key] = JSON.parse(value);
                } catch {
                    result[key] = value;
                }
            }
        }

        return result;
    }

    async ttlKey(key: string): Promise<number> {
        return await this.redis.ttl(key);
    }

    async onModuleDestroy() {
        await this.redis.quit();
        await this.subscriber.quit(); // đừng quên đóng luôn subscriber
    }

}
