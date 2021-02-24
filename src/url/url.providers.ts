import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION, URL_MODEL } from 'src/url/constants';
import { UrlSchema } from './url.schema';

export const UrlProviders = [
  {
    provide: URL_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('Url', UrlSchema),
    inject: [DATABASE_CONNECTION],
  }
];
