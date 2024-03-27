import { ApiProperty } from "@nestjs/swagger"


export class createCategoryDto {
    @ApiProperty({
        example: "Residenciais",
        description: "Nome da categoria",
        required: true
    })
    name: string;
    @ApiProperty({
        example: "Resideenciais consiste na criação de projetos para moradia",
        description: "Descrição da categoria",
        required: true
    })
    description: string;


} 