import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { currentTimestamp } from 'utils/currentTimestamp';
import { LiveChatLogo } from './entities/live_chat_logo.entity';

@Injectable()
export class LiveChatLogoService {
  constructor(
    @InjectRepository(LiveChatLogo)
    private readonly LiveChatLogoRepository: Repository<LiveChatLogo>,

  ) { }
  async create(req: any, file: any, body: any) {
    try {
      const fileUrl = `${process.env.URL_BACKEND}/api/uploads/${file}`;
      const id = Number(body.id);
      if (id) {
        return await this.LiveChatLogoRepository.update(
          { id },
          { file: fileUrl }
        );
      } else {
        // create mới
        const newEntry = this.LiveChatLogoRepository.create({
          file: fileUrl,
          created_at: currentTimestamp(),
        });
        return await this.LiveChatLogoRepository.save(newEntry);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async getOne(req: any) {
    try {
      const resultList = await this.LiveChatLogoRepository.find({
        take: 1, // Lấy 1 bản ghi duy nhất
      });

      const result = resultList[0];
      return result
    } catch (error) {
      console.log(error);
      throw error
    }
  }

}
