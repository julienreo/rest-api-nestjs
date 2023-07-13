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
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { Permission } from '../permissions/enums/permission.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDataInterceptor } from './interceptors/user-data.interceptor';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions(Permission.GET_USER)
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.get(id);
  }

  @Permissions(Permission.LIST_USERS)
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully retrieved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  list(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.list(paginationQueryDto);
  }

  @Permissions(Permission.CREATE_USER)
  @UseInterceptors(UserDataInterceptor)
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permissions(Permission.UPDATE_USER)
  @UseInterceptors(UserDataInterceptor)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permissions(Permission.DELETE_USER)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }
}
