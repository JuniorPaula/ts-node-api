import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookApi } from '@/infra/apis';

export interface HttpClient {
  get(parmas: HttpClient.Params): Promise<void>;
}

export namespace HttpClient {
  export type Params = {
    url: string;
    params: object;
  };
}

describe('FacebookApi', () => {
  let clientId: string;
  let clientSecret: string;
  let httpClient: MockProxy<HttpClient>;
  let sut: FacebookApi;

  beforeAll(() => {
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';

    httpClient = mock();
  });

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  test('Should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });
});
