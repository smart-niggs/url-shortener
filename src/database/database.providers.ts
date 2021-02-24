import * as mongoose from 'mongoose';
import { configService } from '../common/config/config.service';
import { DATABASE_CONNECTION } from '../url/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(configService.getMongoDbUrl(),
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        }
      ),
  },
];

// Use standalone instances for testing and development, but always use replica sets in production.
