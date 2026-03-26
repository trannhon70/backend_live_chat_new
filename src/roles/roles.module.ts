import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RoleRepository } from './role.repository';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]), // inject repository/entity
  ],
  providers: [RolesService, RoleRepository],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule { }