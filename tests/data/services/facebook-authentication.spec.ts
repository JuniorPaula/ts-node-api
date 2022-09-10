import { mock } from 'jest-mock-extended';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { LoadFacebookUserApi } from '@/data/interfaces/apis';

describe('FacebookAuthentication Service', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();

    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1);
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();

    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined);
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
