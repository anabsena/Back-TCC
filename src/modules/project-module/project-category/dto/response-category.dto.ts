import { ApiProperty } from "@nestjs/swagger"
import { ResponseProjectDto } from "../../projects/dto/response-project.dto";


export class ResponseCategoryDto {
    @ApiProperty({
        example: "12312432",
        description: "Id da categoria"
    })
    id: string;
    @ApiProperty({
        example: "Residenciais",
        description: "Nome da categoria"
    })
    name: string;
    @ApiProperty({
        type: () => [ResponseProjectDto]
    })
    Project?: ResponseProjectDto[];

} 