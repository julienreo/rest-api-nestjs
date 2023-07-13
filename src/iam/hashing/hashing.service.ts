import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  /**
   * Hash the given data
   *
   * @param data
   */
  abstract hash(data: string): Promise<string>;

  /**
   * Compare the given data with the hash
   *
   * @param data
   * @param encrypted
   */
  abstract compare(data: string, encrypted: string): Promise<boolean>;
}
