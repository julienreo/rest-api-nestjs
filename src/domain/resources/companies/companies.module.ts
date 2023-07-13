import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { Company } from './company.model';
import { CompaniesService } from './companies.service';
import { User } from 'src/domain/resources/users/user.model';
import { Role } from '../roles/role.model';
import { Permission } from '../permissions/permission.model';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, Role, Permission])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
