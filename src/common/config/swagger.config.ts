import { DocumentBuilder } from '@nestjs/swagger';
import { configService } from './config.service';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('URL SHORTENING API')
  .setDescription('API Service Url Shortener')
  .setVersion(configService.getAppVersionNo())
  .build();
