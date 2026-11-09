import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { configService } from './common/config/config.service';
import { CreateUrlDto } from './url/dto/create-url.dto';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async create(@Body() dto: CreateUrlDto) {
    const code = await this.urlService.create(dto);
    return { code, short_url: `${configService.getBaseUrl()}/${code}` };
  }

  /**
   * 302, not 304. A 304 Not Modified carries no body and tells the client to use
   * its cache - it will not follow Location, so the redirect silently does nothing.
   *
   * This route is single-segment and matches anything, which is why the health
   * routes are deliberately two segments (`/health/live`) and can never be
   * shadowed by it, regardless of declaration order.
   */
  @Get(':short_url')
  async redirect(@Param('short_url') code: string, @Res() res: Response) {
    const longUrl = await this.urlService.findUrl(code);
    res.redirect(302, longUrl);
  }
}
