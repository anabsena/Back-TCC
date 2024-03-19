import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageInfo } from 'src/utils/pageInfo';
import { ResponsePhotoDto } from './response-photo.dto';

export class PhotosResponse {
  @ApiProperty({ type: () => [ResponsePhotoDto] })
  data: ResponsePhotoDto[];

  @ApiProperty({ type: PageInfo, nullable: true })
  pageInfo?: PageInfo;
}

export class PhotoResponse extends PartialType(ResponsePhotoDto) {}