import { ApiProperty } from "@nestjs/swagger"


export class UpdateProjectDto{
    @ApiProperty({
        example: "Residencial",
        description: "Nome do projeto",
        required: false
    })
    name?: string;
    @ApiProperty({
        example: "Projeto residencial realizado em ivaipora",
        description: "Descrição do projeto",
        required: false
    })
    description ?: string;
    @ApiProperty({
        example: "Quartos: 2, Banheiros: 2, Suítes: 2, Vagas: 2",
        description: "Detalhes do projeto",
        required: false
    })
    especificDetails?: string;
} 