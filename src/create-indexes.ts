import mongoose from 'mongoose';
import { configService } from './common/config/config.service';
import { URL_MODEL_NAME } from './url/constants';
import { UrlSchema } from './url/url.schema';

/**
 * One-off job, not a service. Run as an ECS task that exits: a job that runs to
 * completion is supervised differently from a service that gets replaced when it
 * dies, and an index build looping forever inside a service is a classic mistake.
 *
 * syncIndexes() is idempotent - safe to run on every deploy.
 */
async function main(): Promise<void> {
  await mongoose.connect(configService.getMongoDbUrl());
  const Url = mongoose.model(URL_MODEL_NAME, UrlSchema);
  const result = await Url.syncIndexes();
  console.log(`indexes synced for "${URL_MODEL_NAME}":`, result);
  await mongoose.disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('index job failed:', err);
    process.exit(1);
  });
