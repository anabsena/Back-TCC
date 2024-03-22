import { ApiProperty } from "@nestjs/swagger"


export class UpdateUserDto {
    @ApiProperty({
        example: "Ana",
        description: "Nome do admin",
        required: true
    })
    name: string;

    @ApiProperty({
        example: "1234",
        description: "Password",
        required: true
    })
    password: string;
} 