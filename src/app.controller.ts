import { Body, Controller, Get, HttpCode, Param, Post, Query, Res } from '@nestjs/common';
import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { configService } from './common/config/config.service';
import { UrlService } from './url/url.service';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { CreateUrlDto, UrlQueryFilterDto } from './url/dto/create-url.dto';

@Controller()
export class AppController {
  constructor(private readonly urlService: UrlService) { }

  @ApiTags('API Index')
  @Get()
  getIndex(): string {
    return `You have reached ${configService.getAppName().toUpperCase()} routes.`;
  }

  @Get('/urls')
  async getAll(
    @Query() queryFilter: UrlQueryFilterDto,
  ) {
    const query = parseQueryObj(queryFilter);
    return this.urlService.findAll(query);
  }

  @ApiHideProperty()
  @HttpCode(304)
  @Get('/:short_url')
  async getUrl(
    @Param('short_url') shortUrl: string,
    @Res() res: Response
  ) {
    const longUrl = await this.urlService.findUrl(shortUrl);
    res.redirect(304, longUrl);
  }

  @Post()
  async createUrl(
    @Body() newUrl: CreateUrlDto
  ) {
    return this.urlService.create(newUrl);
  }
}
