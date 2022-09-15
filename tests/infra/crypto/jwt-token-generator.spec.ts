import { JwtTokenGenerator } from '@/infra/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  test('Should call sign() with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>;
    const sut = new JwtTokenGenerator('any_secrect');

    await sut.generateToken({ key: 'any_key', expireIn: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: 'any_key' },
      'any_secrect',
      {
        expiresIn: 1,
      },
    );
  });
});
