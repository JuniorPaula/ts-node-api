import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { HttpClient } from './facebook.spec';

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';
  constructor(
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async loadUser(parmas: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}
