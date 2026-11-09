import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION, URL_MODEL, URL_MODEL_NAME } from './constants';
import { UrlSchema } from './url.schema';

export const UrlProviders = [
  {
    provide: URL_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model(URL_MODEL_NAME, UrlSchema),
    inject: [DATABASE_CONNECTION],
  },
];
