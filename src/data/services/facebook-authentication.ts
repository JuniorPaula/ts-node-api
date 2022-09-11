import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/interfaces/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      CreateFacebookAccountRepository &
      UpdateFacebookAccountRepository,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountDate = await this.userAccountRepository.load({
        email: fbData.email,
      });
      if (accountDate !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountDate.id,
          name: accountDate.name ?? fbData.name,
          facebookId: fbData.facebookId,
        });
      } else {
        await this.userAccountRepository.createFromFacebook(fbData);
      }
    }
    return new AuthenticationError();
  }
}
