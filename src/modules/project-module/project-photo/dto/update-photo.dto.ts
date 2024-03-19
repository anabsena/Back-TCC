import { ApiProperty } from "@nestjs/swagger"


export class UpdatePhotoDto{
    @ApiProperty({
        example: "1234",
        description: "Id do projeto",
        required: false
    })
    projectId: string
    @ApiProperty({
        example: "base 64 image",
        description: "foto",
        required: false
    })
    photos?: string;
} 