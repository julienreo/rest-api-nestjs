import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { CachingService } from './caching.service';
import cachingConfig from './config/caching.config';

@Injectable()
export class RedisService extends CachingService {
  private redisClient: Redis;

  constructor(
    @Inject(cachingConfig.KEY)
    private readonly cachingConfiguration: ConfigType<typeof cachingConfig>,
  ) {
    super();
  }

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: this.cachingConfiguration.host,
      port: this.cachingConfiguration.port,
    });
  }

  onApplicationShutdown() {
    this.redisClient.quit();
  }

  /**
   * Get key value
   *
   * @param key
   */
  get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  /**
   * Set key value with optional timeout
   *
   * @param key
   * @param value
   * @param expirationTime Expiration time expressed in seconds
   */
  async set(
    key: string,
    value: string,
    expirationTime?: number,
  ): Promise<void> {
    if (expirationTime) {
      this.redisClient.set(key, value, 'EX', expirationTime);
    } else {
      this.redisClient.set(key, value);
    }
  }

  /**
   * Set key timeout
   *
   * @param key
   * @param value seconds
   */
  async expire(key: string, value: number): Promise<void> {
    await this.redisClient.expire(key, value);
  }

  /**
   * Delete key
   *
   * @param key
   */
  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
