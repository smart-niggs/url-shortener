import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, Max, Min } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  long_url: string;

  @ApiHideProperty()
  @IsOptional()
  @IsUrl()  // added here for service to set value before saving to db
  short_url?: string;
}

enum orderEnum {
  asc = 'asc',
  desc = 'desc'
}

export class UrlQueryFilterDto {
  page?: number = 1;

  @Min(1)
  @Max(200)
  limit?: number = 20;

  order?: orderEnum = orderEnum.desc;

  sort_by?: string = 'created_at';

  search?: string;
}
