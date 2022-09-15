import { JwtTokenGenerator } from '@/infra/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator;
  let fakeJwt: jest.Mocked<typeof jwt>;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
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

  test('Should return a token', async () => {
    const token = await sut.generateToken({ key: 'any_key', expireIn: 1000 });

    expect(token).toEqual('any_token');
  });

  test('Should reThrows if jwt.sign() throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error');
    });
    const promise = sut.generateToken({ key: 'any_key', expireIn: 1000 });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
