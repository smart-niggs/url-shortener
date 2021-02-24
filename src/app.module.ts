import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { UrlModule } from './url/url.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UrlModule
  ],
  controllers: [AppController]
})
export class AppModule { }
