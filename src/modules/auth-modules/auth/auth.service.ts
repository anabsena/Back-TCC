import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync } from "bcrypt";
import { PrismaService } from "src/database/PrismaService";
import { UserService } from "src/modules/user-module/user.service";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private model: PrismaService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                throw new UnauthorizedException(`User not found`);
            }

            const isPasswordValid = compareSync(password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            return user;
        } catch (error) {
            console.log(`Error validating user: ${error}`)
            throw new ConflictException(`Error validating user: ${error}`)
        }
    }

    async login(name: string, password: string): Promise<Object> {

        const user = await this.validateUser(name, password);
        delete user.password;

        const payload = { user: user };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_PHRASE,
        });

        return {
            access_token: accessToken,
        };
    }
}