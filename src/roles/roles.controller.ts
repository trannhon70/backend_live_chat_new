import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async create(@Body() body: any) {
    const data = await this.rolesService.create(body);
    return {
      statusCode: 1,
      message: 'create role success!',
      data: data
    }
  }

  @Get('get-all')
  async findAll() {
    const data = await this.rolesService.findAll();
    return {
      statusCode: 1,
      message: 'get all role success!',
      data: data
    }
  }


}
