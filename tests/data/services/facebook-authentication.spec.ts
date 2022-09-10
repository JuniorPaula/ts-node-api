import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { LoadFacebookUserApi } from '@/data/interfaces/apis';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;

  beforeEach(() => {
    loadFacebookUserApi = mock();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  test('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
