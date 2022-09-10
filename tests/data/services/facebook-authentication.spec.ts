import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features/facebook-authentication';

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params);
    return new AuthenticationError();
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result = undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe('FacebookAuthentication Service', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApiSpy.token).toBe('any_token');
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    loadFacebookUserApiSpy.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
