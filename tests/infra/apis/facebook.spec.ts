import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookApi } from '@/infra/apis';
import { HttpClient } from '@/infra/http';

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
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } });

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

  test('Should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      },
    });
  });

  test('Should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token',
      },
    });
  });
});
