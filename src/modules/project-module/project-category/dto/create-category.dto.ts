import { ApiProperty } from "@nestjs/swagger"


export class createCategoryDto {
    @ApiProperty({
        example: "Residenciais",
        description: "Nome da categoria",
        required: true
    })
    name: string;


} 