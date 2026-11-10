import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data, salt);
      return hashedPassword;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(data, encrypted);
      return isMatch;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
