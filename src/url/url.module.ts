import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UrlProviders } from './url.providers';
import { UrlService } from './url.service';

@Module({
  imports: [DatabaseModule],
  providers: [UrlService, ...UrlProviders],
  exports: [UrlService],
})
export class UrlModule {}
