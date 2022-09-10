import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result = undefined;
  callsCount = 0;

  async loadUser(
    params: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}

describe('FacebookAuthentication Service', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApiSpy.token).toBe('any_token');
    expect(loadFacebookUserApiSpy.callsCount).toBe(1);
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    loadFacebookUserApiSpy.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
