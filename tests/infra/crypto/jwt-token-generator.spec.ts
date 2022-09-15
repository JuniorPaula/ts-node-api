import { JwtTokenGenerator } from '@/infra/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator;
  let fakeJwt: jest.Mocked<typeof jwt>;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secrect');
  });

  test('Should call sign() with correct params', async () => {
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
