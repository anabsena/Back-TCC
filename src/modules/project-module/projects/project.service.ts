import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/database/PrismaService';
import { ProjectResponse, ProjectsResponse } from './dto/get-project.dto';
import { getPageInfo } from 'src/utils/pageInfo';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {


    constructor (private prisma: PrismaService){}
    async create(createProjectDto: createProjectDto): Promise<ProjectResponse> {
        try{
            const {name, description, especificDetails} = createProjectDto
            const projectExists = await this.prisma.project.findFirst({
                where: {
                    name: createProjectDto.name
                }
            })
            if(projectExists){
                throw new Error('Project already exists')
            }
            const newProject = await this.prisma.project.create({
                data: {
                    name: name,
                    description: description,
                    especificDetails: especificDetails,
                    projectCategoryId: '',
                },
            });
            const projectResponse: ProjectResponse = {
                id: newProject.id,
                name: newProject.name,
                description: newProject.description,
                especificDetails: newProject.especificDetails,
            };
    
            return projectResponse;
        }catch(error){
            console.log(`Error creating Project: ${error}`);
            throw new ConflictException(`Error creating Project: ${error}`);
        }
    }
    async findAll(name: string, description: string, especificDetails: string, page?: number,
        perPage?: number, ): Promise<ProjectsResponse> {
            try {
                const where: Prisma.ProjectWhereInput = {}
                const totalCount = await this.prisma.project.count({ where });
                const projects = await this.prisma.project.findMany({
                    where: {
                        name: {
                            contains: name,
                        },
                        description: {
                            contains: description,
                        },
                        especificDetails: {
                            contains: especificDetails,
                        },
                    },
                    take: perPage,
                    skip: (page - 1) * perPage,
                });
                const pageInfo = getPageInfo(totalCount, page, perPage);
    
                return {
                    data: projects,
                    pageInfo,
                };
            } catch (error) {
                console.log(`Error finding Projects: ${error}`);
                throw new ConflictException(`Error finding Projects: ${error}`);
            }
    }
    async findOne(id: string): Promise<ProjectResponse> {
            try {
                const project = await this.prisma.project.findUnique({
                    where: {
                       id:String(id),
                    },
                   
                });
    
                return project
            } catch (error) {
                console.log(`Error finding Project: ${error}`);
                throw new ConflictException(`Error finding Project: ${error}`);
            }
    }
    async update(
        id: string,
        UpdateProjectDto: UpdateProjectDto,
    ): Promise<ProjectResponse>{
        try{
            const {name, description, especificDetails} = UpdateProjectDto
            const projectExists = await this.findOne(id);
            if(!projectExists){
                throw new NotFoundException('Product not found');
            }
            const updatedProject = await this.prisma.project.update({
                where: {
                    id: id,
                },
                data: {
                    name: name ? name : projectExists.name,
                    description: description ? description : projectExists.description,
                    especificDetails: especificDetails ? especificDetails : projectExists.especificDetails,
                },
            });
            return updatedProject
    } catch(error){
        console.log(`Error updating Project: ${error}`);
        throw new Error(`Error updating Project: ${error}`);
    }
}
}
