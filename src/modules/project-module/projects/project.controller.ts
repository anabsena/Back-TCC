import { Body, ConflictException, Controller, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProjectDto } from './dto/create-project.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectResponse, ProjectsResponse } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Project')
@Controller('project')

export class ProjectController {
  constructor(private ProjectService: ProjectService) {}

  @Post('/project') 
  @ApiOperation({ summary: 'Create a new project' })
  
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProjectResponse,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  async create(@Body() createProjectDto: createProjectDto ): Promise<ProjectResponse>{
    try{

      return this.ProjectService.create(createProjectDto);
    }catch(error){
      console.log(`Error creating Project: ${error}`);
      throw new ConflictException(`Error creating Project: ${error}`);
    }

  }
  @Get('/project') 
  @ApiOperation({ summary: 'Get all projects' })
  
  @ApiResponse({ status: 200, type: ProjectsResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiQuery({name:'name', required: false, example: 'Comercial'})
  @ApiQuery({name:'page', required: false, example: '1'})
  @ApiQuery({name:'perPage', required: false, example: '10'})
  @ApiQuery({name:'description', required: false, example: 'Projeto comercial para Jardim Alegre'})
  @ApiQuery({name:'especificDetails', required: false, example: '1 sala, 1 banheiro'})
  async findAll(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('description') description: string,
    @Query('especificDetails') especificDetails: string,
  ): Promise<ProjectsResponse>{
    try{
      const response = await this.ProjectService.findAll(name, description, especificDetails, page, perPage);

      return response
    }catch(error){
      console.error(error);
      throw new NotFoundException(error);
    }

  }
  @Get('/project/:id') 
  @ApiOperation({ summary: 'Get all projects' })
  
  @ApiResponse({ status: 200, type: ProjectsResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({name: 'id', example: 123, description: 'project id'})
  async findOne(
   @Param('id') id: string
  ): Promise<ProjectResponse>{
    try{
      const response = await this.ProjectService.findOne(id);

      return response
    }catch(error){
      console.log(`Error finding Project: ${error}`);
      throw new NotFoundException(`Error finding Project: ${error}`);
    }

  }
  @Patch('/project/:id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, type: ProjectResponse })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error response',
  })
  @ApiParam({name: 'id', example: 123, description: 'project id'})
  async update(
    @Param('id') id: string,
    @Body() UpdateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse>{
try{
  const response = await this.ProjectService.update(id, UpdateProjectDto)
  return response
}catch(error){
  console.error(error);
  throw new NotFoundException(error);
}
}
}