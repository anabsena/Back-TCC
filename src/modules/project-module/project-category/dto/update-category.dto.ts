import { ApiProperty } from "@nestjs/swagger"


export class UpdateCategoryDto{
    @ApiProperty({
        example: "Residenciais",
        description: "Nome da categoria",
        required: false
    })
    name?: string;
} 