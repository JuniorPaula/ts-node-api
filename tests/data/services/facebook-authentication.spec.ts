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
  let token: string;

  beforeAll(() => {
    token = 'any_token';

    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_facebookID',
    });

    userAccountRepo = mock();
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id',
    });

    crypto = mock();
    crypto.generateToken.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    jest.clearAllMocks();

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

  test('Should return authToken on success', async () => {
    const authToken = await sut.perform({ token });

    expect(authToken).toEqual(new AccessToken('any_generated_token'));
  });

  test('Should reThrows LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('fb_error'));
  });

  test('Should reThrows LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_user_error'));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('load_user_error'));
  });

  test('Should reThrows SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
      new Error('save_user_error'),
    );
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('save_user_error'));
  });

  test('Should reThrows TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
