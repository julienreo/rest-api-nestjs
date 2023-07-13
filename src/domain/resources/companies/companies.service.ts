import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.model';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DB_ERROR_CODES } from 'src/constants/app.constants';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { NotFoundError } from 'src/domain/errors/not-found.error';
import { ConflictError } from 'src/domain/errors/conflict.error';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  /**
   * Get a company
   *
   * @param id
   */
  async get(id: string) {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return company;
  }

  /**
   * List all companies
   *
   * @param paginationQueryDto
   */
  list(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    return this.companyRepository.find({
      take: limit,
      skip: offset,
    });
  }

  /**
   * Create a company
   *
   * @param createCompanyDto
   */
  create(createCompanyDto: CreateCompanyDto) {
    return this.companyRepository.save(createCompanyDto);
  }

  /**
   * Update a company
   *
   * @param id
   * @param updateCompanyDto
   */
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.preload({
      id,
      ...updateCompanyDto,
    });
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return this.companyRepository.save(company);
  }

  /**
   * Delete a company
   *
   * @param id
   */
  async delete(id: string) {
    let company: Company;
    try {
      company = await this.companyRepository.findOneBy({ id });
      if (!company) {
        throw new NotFoundError('Company not found');
      }
      company = await this.companyRepository.remove(company);
      return company;
    } catch (err) {
      // If company to delete has users, PostgreSQL will raise a 23503 error
      if (err.code === DB_ERROR_CODES.FOREIGN_KEY_VIOLATION_CODE) {
        throw new ConflictError('Company with users cannot be deleted');
      }
      throw err;
    }
  }
}
