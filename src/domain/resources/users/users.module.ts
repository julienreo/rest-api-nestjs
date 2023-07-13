import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.model';
import { Company } from 'src/domain/resources/companies/company.model';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { Role } from '../roles/role.model';
import { Permission } from '../permissions/permission.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, Role, Permission])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class UsersModule {}
