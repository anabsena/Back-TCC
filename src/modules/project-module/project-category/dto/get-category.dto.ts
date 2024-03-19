import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageInfo } from 'src/utils/pageInfo';
import { ResponseCategoryDto } from './response-category.dto';

export class CategorysResponse {
  @ApiProperty({ type: () => [ResponseCategoryDto] })
  data: ResponseCategoryDto[];

  @ApiProperty({ type: PageInfo, nullable: true })
  pageInfo?: PageInfo;
}

export class CategoryResponse extends PartialType(ResponseCategoryDto) {}