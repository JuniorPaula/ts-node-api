import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/interfaces/repositories';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  let token: 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_email',
      email: 'any_fb_email',
      facebookId: 'any_facebookID',
    });
    loadUserAccountRepo = mock();
    createFacebookAccountRepo = mock();

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo,
    );
  });

  test('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  test('Should return AuthenticationError with LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  test('Should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  test('Should call CreateUserAccountRepo when LoadUserAccountRepo return undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);
    await sut.perform({ token });

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_email',
      email: 'any_fb_email',
      facebookId: 'any_facebookID',
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(
      1,
    );
  });
});
