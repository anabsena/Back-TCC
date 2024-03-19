import { ApiProperty } from "@nestjs/swagger"


export class createPhotoDto {
    @ApiProperty({
        example: "1234",
        description: "id do projeto",
        required: true
    })
    projectId: string;
    @ApiProperty({
        example: "base64 photo",
        description: "photos do projeto",
        required: true
    })
    photos: string;


} 