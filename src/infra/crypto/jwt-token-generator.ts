import jwt from 'jsonwebtoken';
import { TokenGenerator } from '@/data/interfaces/crypto';

export class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expireIn / 1000;
    jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });
  }
}
