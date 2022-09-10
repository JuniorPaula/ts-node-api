import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { LoadFacebookUserApi } from '@/data/interfaces/apis';

import { mock, MockProxy } from 'jest-mock-extended';

type SutTypes = {
  sut: FacebookAuthenticationService;
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
};

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>();
  const sut = new FacebookAuthenticationService(loadFacebookUserApi);

  return {
    sut,
    loadFacebookUserApi,
  };
};

describe('FacebookAuthentication Service', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut();
    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut();

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
