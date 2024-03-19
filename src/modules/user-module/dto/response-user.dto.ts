import { ApiProperty } from "@nestjs/swagger"


export class ResponseUserDto{
    @ApiProperty({
        example: "12312432",
        description: "Id do usuario"
    })
    id: string;
    @ApiProperty({
        example: "Ana",
        description: "Nome do admin"
    })
    name: string;
    @ApiProperty({
        example: "1234",
        description: "Password"
    })
    password : string;
} 