import mongoose, { Mongoose } from 'mongoose';
import { configService } from '../common/config/config.service';
import { DATABASE_CONNECTION } from '../url/constants';

/**
 * Mongo is a hard boot dependency: this factory is awaited during module init,
 * so the process exits if the database is unreachable rather than starting and
 * serving errors. Readiness therefore only ever catches a connection that drops
 * after startup.
 */
export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (): Promise<Mongoose> => mongoose.connect(configService.getMongoDbUrl()),
  },
];
