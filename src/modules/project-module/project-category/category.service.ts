import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/PrismaService';
import { getPageInfo } from 'src/utils/pageInfo';
import { createCategoryDto } from './dto/create-category.dto';
import { CategoryResponse, CategorysResponse } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {


    constructor (private prisma: PrismaService){}
    async create(createCategoryDto: createCategoryDto): Promise<CategoryResponse> {
        try{
            const {name} = createCategoryDto
            const categoryExists = await this.prisma.projectCategory.findFirst({
                where: {
                    name: createCategoryDto.name
                }
            })
            if(categoryExists){
                throw new Error('Category already exists')
            }
            const newCategory = await this.prisma.projectCategory.create({
                data: {
                    name: name,
                },
            });
           
    
            return newCategory;
        }catch(error){
            console.log(`Error creating Category: ${error}`);
            throw new ConflictException(`Error creating Category: ${error}`);
        }
    }
    async findAll(name?: string, page?: number,
        perPage?: number, ): Promise<CategorysResponse> {
            try {
                const where: Prisma.ProjectCategoryWhereInput = {}
                const totalCount = await this.prisma.projectCategory.count({ where });
                const projectsCategory = await this.prisma.projectCategory.findMany({
                    where: {
                        name: {
                            contains: name,
                        }
                    },
                    take: perPage,
                    skip: (page - 1) * perPage,
                });
                const pageInfo = getPageInfo(totalCount, page, perPage);
    
                return {
                    data: projectsCategory,
                    pageInfo,
                };
            } catch (error) {
                console.log(`Error finding Categorys: ${error}`);
                throw new ConflictException(`Error finding Categorys: ${error}`);
            }
    }
    async findOne(id: string): Promise<CategoryResponse> {
            try {
                const projectCategory = await this.prisma.projectCategory.findUnique({
                    where: {
                       id:String(id),
                    },
                   
                });
    
                return projectCategory
            } catch (error) {
                console.log(`Error finding Category: ${error}`);
                throw new ConflictException(`Error finding Category: ${error}`);
            }
    }
    async update(
        id: string,
        UpdateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryResponse>{
        try{
            const {name} = UpdateCategoryDto
            const projectCategoryExists = await this.findOne(id);
            if(!projectCategoryExists){
                throw new NotFoundException('Product not found');
            }
            const updatedProjectCategory = await this.prisma.projectCategory.update({
                where: {
                    id: id,
                },
                data: {
                    name: name ? name : projectCategoryExists.name,
                },
            });
            return updatedProjectCategory
    } catch(error){
        console.log(`Error updating Category: ${error}`);
        throw new Error(`Error updating Category: ${error}`);
    }
}
}
