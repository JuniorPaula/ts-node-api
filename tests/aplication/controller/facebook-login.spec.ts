import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';
import { FacebookLoginController } from '@/aplication/controller/facebook-login';
import { Unauthorized } from '@/aplication/errors';
import { RequiredStringValidation } from '@/aplication/validations';

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new FacebookLoginController(facebookAuth);
  });

  test('Should build validators correctly', async () => {
    const validators = await sut.buildValidators({ token });

    expect(validators).toEqual([
      new RequiredStringValidation('any_token', 'token'),
    ]);
  });

  test('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  test('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      body: new Unauthorized(),
    });
  });

  test('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        accessToken: 'any_value',
      },
    });
  });
});
