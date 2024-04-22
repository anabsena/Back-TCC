import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhotoService } from './photo.service';
import { PhotoResponse, PhotosResponse } from './dto/get-photo.dto';
import { createPhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserGuard } from 'src/modules/auth-modules/auth/auth-user.guard';

@ApiTags('Photo')
@Controller('photo')

export class PhotoController {
  constructor(private PhotoService: PhotoService) { }

  @Post('/photo')
  @ApiOperation({ summary: 'Create a new photo' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: PhotoResponse,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string'
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createPhotoDto: createPhotoDto, @UploadedFile() file: Express.Multer.File,): Promise<PhotoResponse> {
    try {

      createPhotoDto.photo = file

      return this.PhotoService.create(createPhotoDto);
    } catch (error) {
      console.log(`Error creating Photo: ${error}`);
      throw new ConflictException(`Error creating Photo: ${error}`);
    }

  }
  @Get('/photo')
  @ApiOperation({ summary: 'Get all photo' })
  @ApiResponse({ status: 200, type: PhotoResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiQuery({ name: 'projectId', required: false, example: '1234' })
  async findAll(
    @Query('photos') photos: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,

  ): Promise<PhotosResponse> {
    try {
      const response = await this.PhotoService.findAll(photos, page, perPage);

      return response
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error);
    }

  }
  @Get('/photo/:id')
  @ApiOperation({ summary: 'Get all Photo' })

  @ApiResponse({ status: 200, type: PhotosResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({ name: 'id', example: 123, description: 'photo id' })
  async findOne(
    @Param('id') id: string
  ): Promise<PhotoResponse> {
    try {
      const response = await this.PhotoService.findOne(id);

      return response
    } catch (error) {
      console.log(`Error finding Photo: ${error}`);
      throw new NotFoundException(`Error finding Photo: ${error}`);
    }

  }
  @Patch('/photo/:id')
  @ApiOperation({ summary: 'Update a photo' })
  @ApiResponse({ status: 200, type: PhotoResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({ name: 'id', example: 123, description: 'Photo id' })
  async update(
    @Param('id') id: string,
    @Body() UpdatePhotoDto: UpdatePhotoDto,
  ): Promise<PhotoResponse> {
    try {
      const response = await this.PhotoService.update(id, UpdatePhotoDto)
      return response
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error);
    }
  }
  @Delete('/user/:id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    @ApiOperation({ summary: 'Delete a photo' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @ApiParam({ name: 'id', type: 'string' })
    async delete(
        @Param('id') id: string,
    ): Promise<void> {
        try {
            await this.PhotoService.delete(id);
        } catch (error) {
            console.log(error);
            throw new ConflictException(error);
        }
    }
}