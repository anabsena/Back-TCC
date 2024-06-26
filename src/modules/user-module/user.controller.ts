import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponse, UsersResponse } from './dto/get-user.dto';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserGuard } from '../auth-modules/auth/auth-user.guard';

@ApiTags('user')
@Controller('user')

export class UserController {
  constructor(private UserService: UserService) {}

  @Post('/user') 
  @ApiOperation({ summary: 'Create a new user' })
  
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserResponse,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  async create(@Body() createUserDto: createUserDto ): Promise<UserResponse>{
    try{

      return this.UserService.create(createUserDto);
    }catch(error){
      console.log(`Error creating user: ${error}`);
      throw new ConflictException(`Error creating user: ${error}`);
    }

  }
  @Get('/user') 
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: UsersResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiQuery({name:'name', required: false, example: 'Ana'})
  @ApiQuery({name:'page', required: false, example: '1'})
  @ApiQuery({name:'perPage', required: false, example: '10'})
  async findAll(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    
  ): Promise<UsersResponse>{
    try{
      const response = await this.UserService.findAll(name, page, perPage);

      return response
    }catch(error){
      console.error(error);
      throw new NotFoundException(error);
    }

  }
  @Get('/user/:id') 
  @ApiOperation({ summary: 'Get all users' })
  
  @ApiResponse({ status: 200, type: UsersResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({name: 'id', example: 123, description: 'user id'})
  async findOne(
   @Param('id') id: string
  ): Promise<UserResponse>{
    try{
      const response = await this.UserService.findOne(id);

      return response
    }catch(error){
      console.log(`Error finding User: ${error}`);
      throw new NotFoundException(`Error finding User: ${error}`);
    }

  }
  @Patch('/user/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, type: UserResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({name: 'id', example: 123, description: 'project id'})
  async update(
    @Param('id') id: string,
    @Body() UpdateUserDto: UpdateUserDto,
  ): Promise<UserResponse>{
try{
  const response = await this.UserService.update(id, UpdateUserDto)
  return response
}catch(error){
  console.error(error);
  throw new NotFoundException(error);
}
}
@Delete('/user/:id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @ApiParam({ name: 'id', type: 'string' })
    async delete(
        @Param('id') id: string,
    ): Promise<void> {
        try {
            await this.UserService.delete(id);
        } catch (error) {
            console.log(error);
            throw new ConflictException(error);
        }
    }
}