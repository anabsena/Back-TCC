import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/PrismaService';
import { getPageInfo } from 'src/utils/pageInfo';
import { createPhotoDto } from './dto/create-photo.dto';
import { PhotoResponse, PhotosResponse } from './dto/get-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotoService {


    constructor(private prisma: PrismaService) { }
    async create(createPhotoDto: createPhotoDto): Promise<PhotoResponse> {
        try {
            const { photo, projectId } = createPhotoDto
            const projectExists = await this.prisma.project.findFirst({
                where: {
                    id: createPhotoDto.projectId
                }
            })
           
            if (!projectExists) {
                throw new Error('project not exists')
            }
            
            const newPhoto = await this.prisma.projectPhotos.create({
                data: {
                    projectId: projectId,
                    photos: photo.buffer,
                },
            });

            return newPhoto;
        } catch (error) {
            console.log(`Error creating Photo: ${error}`);
            throw new ConflictException(`Error creating Photo: ${error}`);
        }
    }
    async findAll(projectId?: string, page?: number,
        perPage?: number,): Promise<PhotosResponse> {
        try {
            const where: Prisma.ProjectPhotosWhereInput = {}
            const totalCount = await this.prisma.projectPhotos.count({ where });
            const projectsPhoto = await this.prisma.projectPhotos.findMany({
                where: {
                    projectId: {
                        contains: projectId,
                    }
                },
                take: perPage,
                skip: (page - 1) * perPage,
            });
            const pageInfo = getPageInfo(totalCount, page, perPage);

            return {
                data: projectsPhoto,
                pageInfo,
            };
        } catch (error) {
            console.log(`Error finding Photos: ${error}`);
            throw new ConflictException(`Error finding Photos: ${error}`);
        }
    }
    async findOne(id: string): Promise<PhotoResponse> {
        try {
            const projectPhotos = await this.prisma.projectPhotos.findUnique({
                where: {
                    id: String(id),
                },

            });

            return projectPhotos
        } catch (error) {
            console.log(`Error finding Category: ${error}`);
            throw new ConflictException(`Error finding Category: ${error}`);
        }
    }
    async update(
        id: string,
        UpdatePhotoDto: UpdatePhotoDto,
    ): Promise<PhotoResponse> {
        try {
            const { projectId, photos } = UpdatePhotoDto

            const projectPhotosExists = await this.findOne(id);

            if (!projectPhotosExists) {
                throw new NotFoundException('Product not found');
            }

            const updatedProjectPhotos = await this.prisma.projectPhotos.update({
                where: {
                    id: id,
                },
                data: {
                    projectId: projectId ? projectId : projectPhotosExists.projectId,
                    photos: photos.buffer
                },
            });
            return updatedProjectPhotos
        } catch (error) {
            console.log(`Error updating Photos: ${error}`);
            throw new Error(`Error updating Photos: ${error}`);
        }
    }
    async delete(id: string): Promise<void> {
        try {
            // Verifica se a fazenda existe
            const projectPhotos = await this.prisma.projectPhotos.findUnique({
                where: { id },
            });
            if (!projectPhotos) {
                throw new NotFoundException(`Photo not found with id ${id}`);
            }
            await this.prisma.projectCategory.delete({
                where: { id },
            });
        } catch (error) {
            console.log(`DELETE PHOTO ERROR: ${error}`);
            throw new ConflictException(`Error deleting projectPhotos: ${error}`);
        }
    }
}
