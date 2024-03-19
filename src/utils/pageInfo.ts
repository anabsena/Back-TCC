import { getBaseUrl } from './baseUrl';
import { ApiProperty } from '@nestjs/swagger';

export class PageInfo {
  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 5 })
  remainingPages: number;

  @ApiProperty({
    example: { page: 2, url: 'http://example.com/users?page=2' },
    nullable: true,
  })
  nextPage: { page: number | null; url: string | null };

  @ApiProperty({
    example: { page: 1, url: 'http://example.com/users?page=1' },
    nullable: true,
  })
  prevPage: { page: number | null; url: string | null };
}

export function getPageInfo(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
): PageInfo {
  const baseUrl = getBaseUrl();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const remainingPages = totalPages - currentPage;
  const nextPage =
    currentPage < totalPages
      ? {
          page: currentPage + 1,
          url: `${baseUrl}?page=${currentPage + 1}&perPage=${itemsPerPage}`,
        }
      : {
          page: null,
          url: null,
        };
  const prevPage =
    currentPage > 1
      ? {
          page: currentPage - 1,
          url: `${baseUrl}?page=${currentPage - 1}&perPage=${itemsPerPage}`,
        }
      : {
          page: null,
          url: null,
        };

  return {
    totalItems,
    totalPages,
    remainingPages,
    nextPage,
    prevPage,
  };
}