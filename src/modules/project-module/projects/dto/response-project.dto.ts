import { ApiProperty } from "@nestjs/swagger"
import { ResponsePhotoDto } from "../../project-photo/dto/response-photo.dto";


export class ResponseProjectDto{
    @ApiProperty({
        example: "12312432",
        description: "Id do projeto"
    })
    id: string;
    @ApiProperty({
        example: "Residencial",
        description: "Nome do projeto"
    })
    name: string;
    @ApiProperty({
        example: "Projeto residencial realizado em ivaipora",
        description: "Descrição do projeto"
    })
    description : string;
    @ApiProperty({
        example: "Quartos: 2, Banheiros: 2, Suítes: 2, Vagas: 2",
        description: "Detalhes do projeto"
    })
    especificDetails: string;
    @ApiProperty({
        type: () => [ResponsePhotoDto]
    })
    Photo?: ResponsePhotoDto[];
} 