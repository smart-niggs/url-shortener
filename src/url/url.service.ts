import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { URL_MODEL } from 'src/url/constants';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlDto as Url } from './dto/url.dto';
import { configService } from 'src/common/config/config.service';


@Injectable()
export class UrlService {
  constructor(
    @Inject(URL_MODEL) private readonly urlModel: Model<Url>,
  ) { }

  async create(newUrl: CreateUrlDto): Promise<string> {
    const existing = await this.urlModel.findOne({ long_url: newUrl.long_url });
    if (existing)
      return existing.short_url;

    const createdUrl = new this.urlModel(newUrl);
    createdUrl.short_url = configService.getBaseUrl() + this.genRandom();

    return (await createdUrl.save()).short_url;
  }

  async findAll(params): Promise<FindAllQueryInterface<Url>> {
    const count = await this.urlModel.countDocuments(params.where);
    const result = await this.urlModel.find(params.where)
      .skip(params.skip)
      .limit(params.limit)
      .select('long_url short_url')
      .sort(params.sort)
      .exec();

    const paging = pagingParser(params, count, result.length);

    return {
      paging,
      data: result
    };
  }

  async findUrl(shortUrl: string): Promise<string> {
    const short_url = configService.getBaseUrl() + shortUrl
    const url = await this.urlModel.findOne({ short_url })
      .select('long_url active')
      .exec();

    if (!url)
      throw new BadRequestException('Url not found');
    if (!url.active)
      throw new BadRequestException('Url deactivated');

    return url.long_url;
  }

  private genRandom(no = 6): string {
    let text = '';
    const possible = 'ABCDEGHJKLMNOPQRSTVWXYZabcdefghjklmnopqrstvwxyz0123456789';
    for (let i = 0; i < no; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}

