import { randomBytes } from 'node:crypto';
import { Inject, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Model } from 'mongoose';
import { URL_MODEL } from './constants';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlDoc } from './url.schema';

// Ambiguous characters (I, l, 1, O, 0, U) left out so a code survives being
// read aloud or copied by hand.
const ALPHABET = 'ABCDEGHJKLMNPQRSTVWXYZabcdefghjkmnopqrstvwxyz23456789';

const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;

@Injectable()
export class UrlService {
  constructor(@Inject(URL_MODEL) private readonly urlModel: Model<UrlDoc>) {}

  /** Returns the short code only. The caller builds the full URL from BASE_URL. */
  async create(dto: CreateUrlDto): Promise<string> {
    const existing = await this.urlModel.findOne({ long_url: dto.long_url }).exec();
    if (existing) return existing.short_url;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const created = await this.urlModel.create({
          long_url: dto.long_url,
          short_url: this.newCode(),
        });
        return created.short_url;
      } catch (err) {
        // 11000 is Mongo's duplicate-key error. The unique index is the real
        // guard against a collision; this only picks another candidate.
        if (err?.code !== 11000) throw err;
      }
    }

    throw new ServiceUnavailableException('could not allocate a short code');
  }

  async findUrl(code: string): Promise<string> {
    const url = await this.urlModel.findOne({ short_url: code }).select('long_url active').exec();

    if (!url) throw new NotFoundException('url not found');
    if (!url.active) throw new NotFoundException('url deactivated');

    return url.long_url;
  }

  /** randomBytes, not Math.random - codes should not be predictable. */
  private newCode(): string {
    let out = '';
    for (const byte of randomBytes(CODE_LENGTH)) out += ALPHABET[byte % ALPHABET.length];
    return out;
  }
}
