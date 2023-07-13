import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  /**
   * Hash the given data
   *
   * @param data
   */
  async hash(data: string): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  /**
   * Compare the given data with the hash
   *
   * @param data
   * @param encrypted
   */
  compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
