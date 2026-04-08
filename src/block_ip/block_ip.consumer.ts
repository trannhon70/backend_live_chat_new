// users/users.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEvents } from 'src/kafka/kafka.events';
import { Repository } from 'typeorm';
import { BlockIpRepository } from './block_ip.repository';
import { BlockIp } from './entities/block_ip.entity';


@Controller()
export class BlockIpConsumer {
    private readonly logger = new Logger(BlockIpConsumer.name);
    constructor(
        @InjectRepository(BlockIp)
        private readonly blockIpRepo: Repository<BlockIp>,

        private readonly blockIpRepository: BlockIpRepository,
    ) { }

    @MessagePattern(DomainEvents.BlockIp_create)
    async handleBlockIpCreated(@Payload() payload: any) {
        try {
            return await this.blockIpRepository.create(payload);
        } catch (error) {
            this.logger.error('Failed to process label created event', error);
            throw error;
        }
    }

}