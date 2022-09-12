import { AccessToken } from '@/domain/models';

describe('AccessToken', () => {
  test('Should create with a value', async () => {
    const sut = new AccessToken('any_value');
    expect(sut).toEqual({ value: 'any_value' });
  });

  test('Should expire in 1800000 ms', async () => {
    expect(AccessToken.expirationInMiliseconds).toEqual(1800000);
  });
});
