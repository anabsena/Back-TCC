import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageInfo } from 'src/utils/pageInfo';
import { ResponseProjectDto } from './response-project.dto';

export class ProjectsResponse {
  @ApiProperty({ type: () => [ResponseProjectDto] })
  data: ResponseProjectDto[];

  @ApiProperty({ type: PageInfo, nullable: true })
  pageInfo?: PageInfo;
}

export class ProjectResponse extends PartialType(ResponseProjectDto) {}