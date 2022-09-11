import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/interfaces/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly laodUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (fbData !== undefined) {
      await this.laodUserAccountRepository.load({ email: fbData.email });
      await this.createFacebookAccountRepository.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}
