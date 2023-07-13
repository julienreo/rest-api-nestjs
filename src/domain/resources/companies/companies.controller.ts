import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { Permission } from '../permissions/enums/permission.enum';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Permissions(Permission.GET_COMPANY)
  @ApiOperation({ summary: 'Get a company' })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully retrieved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.get(id);
  }

  @Permissions(Permission.LIST_COMPANIES)
  @ApiOperation({ summary: 'List all companies' })
  @ApiResponse({
    status: 200,
    description: 'The companies have been successfully retrieved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  list(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.companiesService.list(paginationQueryDto);
  }

  @Permissions(Permission.CREATE_COMPANY)
  @ApiOperation({ summary: 'Create a company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Permissions(Permission.UPDATE_COMPANY)
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Permissions(Permission.DELETE_COMPANY)
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.delete(id);
  }
}
