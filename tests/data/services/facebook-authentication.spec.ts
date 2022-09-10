import { FacebookAuthentication } from '@/domain/features/facebook-authentication';

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params);
  }
}

interface LoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApi.Params): Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
  }
}

describe('FacebookAuthentication Service', () => {
  test('Should call LoadFacebookUserApiSpy with correct params', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApiSpy.token).toBe('any_token');
  });
});
