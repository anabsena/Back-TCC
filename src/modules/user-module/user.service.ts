import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/PrismaService';
import { getPageInfo } from 'src/utils/pageInfo';
import { createUserDto } from './dto/create-user.dto';
import { UserResponse, UsersResponse } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: email
                }
            })

            return user;
        } catch (error) {
            console.log(`Error fetching user: ${error}`);
            throw new ConflictException(`Error fetching user: ${error}`);
        }
    }

    async create(createUserDto: createUserDto): Promise<UserResponse> {
        try {
            const { name, password, email } = createUserDto

            const userExists = await this.findByEmail(email)

            if (userExists) {
                throw new Error('user already exists')
            }

            const saltRounds = 10;

            // Generate a salt
            const salt = genSaltSync(saltRounds);
            const hashedPassword = await hash(password, salt);

            const newUser = await this.prisma.user.create({
                data: {
                    name: name,
                    password: hashedPassword,
                    email: email,
                },
            });
            const userResponse: UserResponse = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            };

            return userResponse;
        } catch (error) {
            console.log(`Error creating user: ${error}`);
            throw new ConflictException(`Error creating user: ${error}`);
        }
    }
    async findAll(name: string, page?: number,
        perPage?: number): Promise<UsersResponse> {
        try {
            const where: Prisma.UserWhereInput = {}
            const totalCount = await this.prisma.user.count({ where });
            const users = await this.prisma.user.findMany({
                where: {
                    name: {
                        contains: name,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
                
            });
            const pageInfo = getPageInfo(totalCount, page, perPage);
            const response: UsersResponse = {
                data: users,
                pageInfo: pageInfo,
            }
            return response

            
        } catch (error) {
            console.log(`Error finding users: ${error}`);
            throw new ConflictException(`Error finding users: ${error}`);
        }
    }
    async findOne(id: string): Promise<UserResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: String(id),
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
    ): Promise<UserResponse> {
        try {
            const { name, password } = UpdateUserDto
            const userExists = await this.findOne(id);
            if (!userExists) {
                throw new NotFoundException('Product not found');
            }

            const saltRounds = 10;

            // Generate a salt
            const salt = genSaltSync(saltRounds);
            const hashedPassword = await hash(password, salt);

            const updatedUser = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    name: name ? name : userExists.name,
                    password: hashedPassword,

                },
            });
            return updatedUser
        } catch (error) {
            console.log(`Error updating user: ${error}`);
            throw new Error(`Error updating user: ${error}`);
        }
    }
    async delete(id: string): Promise<void> {
        try {
            // Verifica se a fazenda existe
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new NotFoundException(`User not found with id ${id}`);
            }

            // Deleta a fazenda
            await this.prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            console.log(`DELETE USER ERROR: ${error}`);
            throw new ConflictException(`Error deleting user: ${error}`);
        }
    }
}
