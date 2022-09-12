import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { TokenGenerator } from '@/data/interfaces/crypto';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/interfaces/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken, FacebookAccount } from '@/domain/models';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountDate = await this.userAccountRepository.load({
        email: fbData.email,
      });

      const facebookAccount = new FacebookAccount(fbData, accountDate);

      const { id } = await this.userAccountRepository.saveWithFacebook(
        facebookAccount,
      );
      await this.crypto.generateToken({
        key: id,
        expireIn: AccessToken.expirationInMiliseconds,
      });
    }
    return new AuthenticationError();
  }
}
