import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/PrismaService';
import { getPageInfo } from 'src/utils/pageInfo';
import { createUserDto } from './dto/create-user.dto';
import { UserResponse, UsersResponse } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {


    constructor (private prisma: PrismaService){}
    async create(createUserDto: createUserDto): Promise<UserResponse> {
        try{
            const {name, password} = createUserDto
            const projectExists = await this.prisma.user.findFirst({
                where: {
                    name: createUserDto.name
                }
            })
            if(projectExists){
                throw new Error('Project already exists')
            }
            const newUser = await this.prisma.user.create({
                data: {
                    name: name,
                   password: password
                },
            });
            const userResponse: UserResponse = {
                id: newUser.id,
                name: newUser.name,
                password: newUser.password
            };
    
            return userResponse;
        }catch(error){
            console.log(`Error creating user: ${error}`);
            throw new ConflictException(`Error creating user: ${error}`);
        }
    }
    async findAll(name: string, password: string, page?: number,
        perPage?: number ): Promise<UsersResponse> {
            try {
                const where: Prisma.UserWhereInput = {}
                const totalCount = await this.prisma.user.count({ where });
                const users = await this.prisma.user.findMany({
                    where: {
                        name: {
                            contains: name,
                        },
                        password:{
                            contains: password
                        }
                    },
                    take: perPage,
                    skip: (page - 1) * perPage,
                });
                const pageInfo = getPageInfo(totalCount, page, perPage);
                return {
                    data: users,
                    pageInfo
                    
                };
            } catch (error) {
                console.log(`Error finding users: ${error}`);
                throw new ConflictException(`Error finding users: ${error}`);
            }
    }
    async findOne(id: string): Promise<UserResponse> {
            try {
                const user = await this.prisma.user.findUnique({
                    where: {
                       id:String(id),
                    },
                   
                });
    
                return user
            } catch (error) {
                console.log(`Error finding user: ${error}`);
                throw new ConflictException(`Error finding user: ${error}`);
            }
    }
    async update(
        id: string,
        UpdateUserDto: UpdateUserDto,
    ): Promise<UserResponse>{
        try{
            const {name, password} = UpdateUserDto
            const userExists = await this.findOne(id);
            if(!userExists){
                throw new NotFoundException('Product not found');
            }
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    name: name ? name : userExists.name,
                    password: password ? password : userExists.password,
                    
                },
            });
            return updatedUser
    } catch(error){
        console.log(`Error updating user: ${error}`);
        throw new Error(`Error updating user: ${error}`);
    }
}
}
