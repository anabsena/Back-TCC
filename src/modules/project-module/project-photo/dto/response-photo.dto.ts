import { ApiProperty } from '@nestjs/swagger';

export class ResponsePhotoDto {
  @ApiProperty({
    example: '12312432',
    description: 'Id da photo',
  })
  id: string;

  @ApiProperty({
    example: '1234',
    description: 'id po projeto',
  })
  projectId: string;

  @ApiProperty({
    example: 'base 64 image',
    description: 'photo',
  })
  photoUrl: string;
}
