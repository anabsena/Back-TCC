import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryResponse, CategorysResponse } from './dto/get-category.dto';
import { createCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthUserGuard } from 'src/modules/auth-modules/auth/auth-user.guard';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/category')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CategoryResponse,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  async create(
    @Body() CreateCategoryDto: createCategoryDto,
  ): Promise<CategoryResponse> {
    try {
      return this.categoryService.create(CreateCategoryDto);
    } catch (error) {
      console.log(`Error creating category: ${error}`);
      throw new ConflictException(`Error creating category: ${error}`);
    }
  }
  @Get('/category')
  @ApiOperation({ summary: 'Get all categorys' })
  @ApiResponse({ status: 200, type: CategorysResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiQuery({ name: 'name', required: false, example: 'Comercial' })
  async findAll(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<CategorysResponse> {
    try {
      const response = await this.categoryService.findAll(name, page, perPage);

      return response;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error);
    }
  }
  @Get('/category/:id')
  @ApiOperation({ summary: 'Get all categorys' })
  @ApiResponse({ status: 200, type: CategorysResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({ name: 'id', example: 123, description: 'category id' })
  async findOne(@Param('id') id: string): Promise<CategoryResponse> {
    try {
      const response = await this.categoryService.findOne(id);

      return response;
    } catch (error) {
      console.log(`Error finding category: ${error}`);
      throw new NotFoundException(`Error finding category: ${error}`);
    }
  }
  @Patch('/category/:id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: CategoryResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({ name: 'id', example: 123, description: 'category id' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    try {
      const response = await this.categoryService.update(id, updateCategoryDto);
      return response;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error);
    }
  }
  @Delete('/category/:id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @ApiParam({ name: 'id', type: 'string' })
    async delete(
        @Param('id') id: string,
    ): Promise<void> {
        try {
            await this.categoryService.delete(id);
        } catch (error) {
            console.log(error);
            throw new ConflictException(error);
        }
    }
}