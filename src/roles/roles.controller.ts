import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
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
  //cấu trúc này dành cho dữ liệu cực lớn lên hàng triệu row
  // @Get('get-all')
  // async findAll(@Res() res: any) {
  //   const stream = await this.rolesService.findAll();
  //   res.setHeader('Content-Type', 'application/json');
  //   res.write('{"statusCode":1,"message":"get all role success!","data":[');
  //   let first = true;
  //   for await (const row of stream) {
  //     if (!first) res.write(',');
  //     res.write(JSON.stringify(row));
  //     first = false;
  //   }

  //   res.write(']');
  //   res.end();
  // }

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
