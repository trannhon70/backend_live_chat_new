import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepo: RoleRepository
  ) { }

  async create(body: any) {
    try {

    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findAll() {
    try {
      return await this.roleRepo.findAll();
    } catch (error) {
      console.log(error);
      throw error
    }

  }


}
