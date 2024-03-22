import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/database/PrismaService";
import { UserService } from "src/modules/user-module/user.service";
import { AuthController } from "./auth-controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
      JwtModule.register({
        global: true,
        secret: process.env.JWT_PHRASE,
        signOptions: { expiresIn: '7d' },
      }),
    ],
    controllers: [AuthController],
    providers: [
      AuthService,
      UserService,
      PrismaService,
    ],
  })
  export class AuthModule {}
  