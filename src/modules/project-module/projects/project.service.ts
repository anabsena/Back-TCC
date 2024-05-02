import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/database/PrismaService';
import { ProjectResponse, ProjectsResponse } from './dto/get-project.dto';
import { getPageInfo } from 'src/utils/pageInfo';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {


    constructor(private prisma: PrismaService) { }
    async create(userId: string, createProjectDto: createProjectDto): Promise<ProjectResponse> {
        try {
            const { name, description, especificDetails, projectCategoryId } = createProjectDto

            console.log(userId)

            const projectExists = await this.prisma.project.findFirst({
                where: {
                    name,
                }
            })

            console.log(projectCategoryId)

            if (projectExists !== null) {
                throw new Error('Project already exists')
            }

            const newProject = await this.prisma.project.create({
                data: {
                    name: name,
                    description: description,
                    especificDetails: especificDetails,
                    projectCategoryId: '420003d2-c12f-4da1-ad4d-ad8a7c658c62',
                    userId: userId,
                },

            });
            const projectResponse: ProjectResponse = {
                id: newProject.id,
                name: newProject.name,
                description: newProject.description,
                especificDetails: newProject.especificDetails,
                projectCategoryId: projectCategoryId,
            };

            return projectResponse;
        } catch (error) {
            console.log(`Error creating Project: ${error}`);
            throw new ConflictException(`Error creating Project: ${error}`);
        }
    }
    async findAll(name?: string, description?: string, especificDetails?: string, page?: number,
        perPage?: number,): Promise<ProjectsResponse> {
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
                take: Number(perPage),
                skip: (page - 1) * perPage,
                orderBy: { createdAt: 'desc' },
                include: {
                    ProjectPhotos: true,
                }
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
                    id: String(id),
                },
                include: {
                    ProjectPhotos: true,
                }
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
    ): Promise<ProjectResponse> {
        try {
            const { name, description, especificDetails } = UpdateProjectDto
            const projectExists = await this.findOne(id);
            if (!projectExists) {
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
        } catch (error) {
            console.log(`Error updating Project: ${error}`);
            throw new Error(`Error updating Project: ${error}`);
        }
    }
    async delete(id: string): Promise<void> {
        try {
            // Verifica se a fazenda existe
            const project = await this.prisma.project.findUnique({
                where: { id },
            });
            if (!project) {
                throw new NotFoundException(`Project not found with id ${id}`);
            }

            // Deleta a fazenda
            await this.prisma.project.delete({
                where: { id },
            });

            await this.prisma.projectPhotos.deleteMany({
                where: {
                    projectId: id
                }
            })
        } catch (error) {
            console.log(`DELETE PROJECT ERROR: ${error}`);
            throw new ConflictException(`Error deleting project: ${error}`);
        }
    }

}
