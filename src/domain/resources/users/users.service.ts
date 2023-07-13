import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DB_ERROR_CODES } from 'src/constants/app.constants';
import { BadRequestError } from 'src/domain/errors/bad-request.error';
import { ConflictError } from 'src/domain/errors/conflict.error';
import { NotFoundError } from 'src/domain/errors/not-found.error';
import { Company } from 'src/domain/resources/companies/company.model';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Get a user
   *
   * @param id
   */
  async get(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { company: true, role: { permissions: true } },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * List all users
   *
   * @param paginationQueryDto
   */
  list(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    return this.userRepository.find({
      take: limit,
      skip: offset,
      relations: { company: true, role: { permissions: true } },
    });
  }

  /**
   * Create a user
   *
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    let user: User;
    let company: Company;

    // If company is supplied, check that it exists
    if (createUserDto.companyId) {
      company = await this.companyRepository.findOneBy({
        id: createUserDto.companyId,
      });
      if (!company) {
        throw new BadRequestError('Company does not exist');
      }
    }

    // Create user
    try {
      user = await this.userRepository.save({
        ...createUserDto,
        ...(company && { company }),
        password: await this.hashingService.hash(createUserDto.password),
      });
    } catch (err) {
      // If email already exists, PostgreSQL will raise a 23505 error
      if (err.code === DB_ERROR_CODES.UNIQUE_VIOLATION_CODE) {
        throw new ConflictError('User already exists');
      }
      throw err;
    }
    return user;
  }

  /**
   * Update a user
   *
   * @param id
   * @param updateUserDto
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    let user: User;
    let company: Company;

    // Load user from DB and update its data
    user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      ...(updateUserDto?.password && {
        password: await this.hashingService.hash(updateUserDto.password),
      }),
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // If company is supplied, check that it exists
    if (updateUserDto.companyId) {
      company = await this.companyRepository.findOneBy({
        id: updateUserDto.companyId,
      });
      if (!company) {
        throw new BadRequestError('Company does not exist');
      }
    }

    // Save user
    try {
      user = await this.userRepository.save({
        ...user,
        ...(company && { company }),
      });
    } catch (err) {
      // If email already exists, PostgreSQL will raise a 23505 error
      if (err.code === DB_ERROR_CODES.UNIQUE_VIOLATION_CODE) {
        throw new ConflictError('Email is already used');
      }
      throw err;
    }
    return user;
  }

  /**
   * Delete a user
   *
   * @param id
   */
  async delete(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return await this.userRepository.remove(user);
  }
}
