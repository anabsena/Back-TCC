import { ApiProperty } from "@nestjs/swagger"


export class createUserDto {
    @ApiProperty({
        example: "Ana",
        description: "Admin",
        required: true
    })
    name: string;

    @ApiProperty({
        example: "1234",
        description: "Password",
        required: true
    })
    password: string;    

    @ApiProperty({
        example: "example@test.com",
        description: "Email",
        required: true
    })
    email: string;   
} 