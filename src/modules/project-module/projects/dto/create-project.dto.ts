import { ApiProperty } from "@nestjs/swagger"


export class createProjectDto {
    @ApiProperty({
        example: "Residencial",
        description: "Nome do projeto",
        required: true
    })
    name: string;

    @ApiProperty({
        example: "Projeto residencial realizado em ivaipora",
        description: "Descrição do projeto",
        required: true
    })
    description: string;

    @ApiProperty({
        example: "Quartos: 2, Banheiros: 2, Suítes: 2, Vagas: 2",
        description: "Detalhes do projeto",
        required: true
    })
    especificDetails: string;

    @ApiProperty({
        example: "https://images.unsplash.com",
        description: "Fotos do projeto",
        required: true
    })
    photos: string[];
} 