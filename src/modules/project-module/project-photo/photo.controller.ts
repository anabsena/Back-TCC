import { Body, ConflictException, Controller, Delete, Get, Header, NotFoundException, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhotoService } from './photo.service';
import { PhotoResponse, PhotosResponse } from './dto/get-photo.dto';
import { createPhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserGuard } from 'src/modules/auth-modules/auth/auth-user.guard';

import { StorageService, StorageServiceType } from 'src/services/storage.service';
import { Response } from 'express';

@ApiTags('Photo')
@Controller('photo')

export class PhotoController {
  constructor(private PhotoService: PhotoService, private storageService: StorageService) { }

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

  @Delete('/photo/:id')
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

  @Get('/v1/storage/file/:key')
  @ApiOperation({ summary: 'Find an file especific' })
  @Header('Content-Type', 'image/jpeg')
  @ApiProduces('image/jpeg')
  @ApiParam({
    name: 'key',
    example: '/face/file.jpg',
    description: 'File source',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Image retrieved successfully',
    content: {
      'image/jpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'File not found' })
  async file(@Param('key') key: string, @Res() res: Response): Promise<void> {
    try {
      const file = await this.storageService.getFile(
        StorageServiceType.S3,
        key,
      );

      res.header('Content-Type', 'image/jpeg'); // Substitua 'image/jpeg' pelo tipo correto, se necessário

      if (Buffer.isBuffer(file)) {
        // Verifica se file.photo é um buffer válido
        res.end(file);
      } else {
        // Se não for um buffer válido, retorne um erro 500 ou apropriado
        console.error('Erro: O conteúdo do arquivo não é um buffer válido.');
        res.status(500).send('Erro interno do servidor');
      }
    } catch (error) {
      console.error(`Erro ao buscar arquivo do S3: ${error}`);
      throw new NotFoundException(`Erro ao arquivo imagem do S3: ${error}`);
    }
  }
}