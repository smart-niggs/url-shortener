import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { UrlModule } from './url/url.module';

@Module({
  imports: [UrlModule, DatabaseModule],
  controllers: [AppController, HealthController],
})
export class AppModule {}
