import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import { TokenGenerator } from '@/data/interfaces/crypto';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/interfaces/repositories';

import { mock, MockProxy } from 'jest-mock-extended';
import { AccessToken } from '@/domain/models';

jest.mock('@/domain/models/facebook-account', () => {
  return {
    FacebookAccount: jest.fn().mockImplementation(() => ({})),
  };
});

describe('FacebookAuthentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >;

  let sut: FacebookAuthenticationService;
  let token: 'any_token';

  beforeEach(() => {
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_facebookID',
    });

    userAccountRepo = mock();
    userAccountRepo.saveWithFacebook.mockResolvedValueOnce({
      id: 'any_account_id',
    });

    crypto = mock();

    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto,
    );
  });

  test('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  test('Should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  test('Should call SaveFacebookAccountRepository with facebookAccount', async () => {
    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({});
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  test('Should call TokenGenerator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expireIn: AccessToken.expirationInMiliseconds,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });
});
