import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { HttpClient } from '@/infra/http';

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com';
  constructor(
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async loadUser(
    parmas: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: parmas.token,
      },
    });

    const userInfo = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: parmas.token,
      },
    });

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    };
  }
}
