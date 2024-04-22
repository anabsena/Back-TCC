import { Body, ConflictException, Controller, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, Request, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProjectDto } from './dto/create-project.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectResponse, ProjectsResponse } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthUserGuard } from 'src/modules/auth-modules/auth/auth-user.guard';

@ApiTags('Project')
@Controller('project')

export class ProjectController {
  constructor(private ProjectService: ProjectService) { }

  @Post('/project')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Create a new project' })

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProjectResponse,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  async create(@Request() req: any, @Body() createProjectDto: createProjectDto): Promise<ProjectResponse> {
    try {
      const userId = req.auth.user.id;

      return this.ProjectService.create(userId, createProjectDto);
    } catch (error) {
      console.log(`Error creating Project: ${error}`);
      throw new ConflictException(`Error creating Project: ${error}`);
    }

  }
  @Get('/project')
  @ApiOperation({ summary: 'Get all projects' })

  @ApiResponse({ status: 200, type: ProjectsResponse })
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiQuery({ name: 'name', required: false, example: 'Comercial' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'perPage', required: false, example: '10' })
  @ApiQuery({ name: 'description', required: false, example: 'Projeto comercial para Jardim Alegre' })
  @ApiQuery({ name: 'especificDetails', required: false, example: '1 sala, 1 banheiro' })
  async findAll(
    @Request() req: any,
    @Query('name') name?: string,
    @Query('especificDetails') especificDetails?: string,
    @Query('description') description?: string,
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ): Promise<ProjectsResponse> {
    try {
      const response = await this.ProjectService.findAll(name, description, especificDetails, page, perPage);

      return response
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error);
    }

  }
  @Get('/project/:id')
  @ApiOperation({ summary: 'Get all projects' })
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiResponse({ status: 200, type: ProjectsResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({ name: 'id', example: 123, description: 'project id' })
  async findOne(
    @Request() req: any,
    @Param('id') id: string
  ): Promise<ProjectResponse> {
    try {
      const response = await this.ProjectService.findOne(id);

      return response
    } catch (error) {
      console.log(`Error finding Project: ${error}`);
      throw new NotFoundException(`Error finding Project: ${error}`);
    }

  }
  @Patch('/project/:id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, type: ProjectResponse })
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({ name: 'id', example: 123, description: 'project id' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() UpdateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    try {
      const response = await this.ProjectService.update(id, UpdateProjectDto)
      return response
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error);
    }
  }
  @Delete('/project/:id')
    @ApiBearerAuth()
    @UseGuards(AuthUserGuard)
    @ApiOperation({ summary: 'Delete a project' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @ApiParam({ name: 'id', type: 'string' })
    async delete(
        @Param('id') id: string,
    ): Promise<void> {
        try {
            await this.ProjectService.delete(id);
        } catch (error) {
            console.log(error);
            throw new ConflictException(error);
        }
    }
}