import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';

@Injectable()
export abstract class CachingService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  abstract onApplicationBootstrap(): void;

  abstract onApplicationShutdown(): void;

  /**
   * Get key value
   *
   * @param key
   */
  abstract get(key: string): Promise<string>;

  /**
   * Set key value with optional timeout
   *
   * @param key
   * @param value
   * @param expirationTime Expiration time expressed in seconds
   */
  abstract set(
    key: string,
    value: string,
    expirationTime?: number,
  ): Promise<unknown>;

  /**
   * Set key timeout
   *
   * @param key
   * @param value seconds
   */
  abstract expire(key: string, value: number): Promise<unknown>;

  /**
   * Delete key
   *
   * @param key
   */
  abstract delete(key: string): Promise<unknown>;
}
