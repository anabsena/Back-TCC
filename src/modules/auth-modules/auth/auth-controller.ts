import { Controller, Post, UnauthorizedException, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('v1/auth/login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: Object,
    })
    @ApiQuery({
        example: 'Ana',
        name: 'name',
        required: true,
    })
    @ApiQuery({
        example: '<PASSWORD>',
        name: 'password',
        required: true,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Query('name') name: string, @Query('password') password: string): Promise<Object> {
        try {
            return this.authService.login(name, password);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException();
            }
        }
    }
}
