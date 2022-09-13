import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { HttpClient } from './facebook.spec';

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';
  constructor(private readonly httpClient: HttpClient) {}

  async loadUser(parmas: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
    });
  }
}
