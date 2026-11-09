import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Config is read and validated at module load, so a missing variable throws a
 * named error on boot rather than surfacing as a connection failure later.
 */
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort(): string {
    return this.getValue('PORT');
  }

  public getMongoDbUrl(): string {
    return this.getValue('MONGO_DB_URL');
  }

  /** Trailing slashes stripped so callers can safely append `/<code>`. */
  public getBaseUrl(): string {
    return this.getValue('BASE_URL').replace(/\/+$/, '');
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'NODE_ENV',
  'PORT',
  'MONGO_DB_URL',
  'BASE_URL',
]);

export { configService };
