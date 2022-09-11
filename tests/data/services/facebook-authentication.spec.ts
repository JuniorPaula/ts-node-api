import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { LoadFacebookUserApi } from '@/data/interfaces/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/interfaces/repositories';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository &
      CreateFacebookAccountRepository &
      UpdateFacebookAccountRepository
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

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
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

  test('Should call CreateFacebookAccountRepository when LoadUserAccountRepo return undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined);
    await sut.perform({ token });

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_facebookID',
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  test('Should call UpdateFacebookAccountRepository when LoadUserAccountRepo return data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });
    await sut.perform({ token });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_facebookID',
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });

  test('Should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
    });
    await sut.perform({ token });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_facebookID',
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });
});
