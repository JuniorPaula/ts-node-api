import jwt from 'jsonwebtoken';
import { TokenGenerator } from '@/data/interfaces/crypto';

export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(
    params: TokenGenerator.Params,
  ): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expireIn / 1000;
    const token = jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }
}
