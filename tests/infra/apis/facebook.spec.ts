import { mock } from 'jest-mock-extended';
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
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';
  test('Should get app token', async () => {
    const httpClient = mock<HttpClient>();
    const sut = new FacebookApi(httpClient, clientId, clientSecret);

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
