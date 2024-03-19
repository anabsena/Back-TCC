import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageInfo } from 'src/utils/pageInfo';
import { ResponseUserDto } from './response-user.dto';

export class UsersResponse {
  @ApiProperty({ type: () => [ResponseUserDto] })
  data: ResponseUserDto[];

  @ApiProperty({ type: PageInfo, nullable: true })
  pageInfo?: PageInfo;
}

export class UserResponse extends PartialType(ResponseUserDto) {}