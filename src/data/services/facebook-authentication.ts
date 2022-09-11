import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/interfaces/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountDate = await this.userAccountRepository.load({
        email: fbData.email,
      });

      await this.userAccountRepository.saveWithFacebook({
        id: accountDate?.id,
        name: accountDate?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
