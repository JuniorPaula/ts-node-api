import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';
import { FacebookLoginController } from '@/aplication/controller/facebook-login';
import { ServerError, Unauthorized } from '@/aplication/errors';
import { RequiredStringValidation } from '@/aplication/validations/required-string';

jest.mock('@/aplication/validations/required-string');

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

  test('Should return 400 if token is empty', async () => {
    const RequiredStringValidationSpy = jest
      .fn()
      .mockImplementationOnce(() => ({
        validate: jest.fn().mockReturnValueOnce(new Error('validation_error')),
      }));

    jest
      .mocked(RequiredStringValidation)
      .mockImplementationOnce(RequiredStringValidationSpy);

    const httpResponse = await sut.handle({ token });

    expect(RequiredStringValidation).toHaveBeenCalledWith('any_token', 'token');
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('validation_error'),
    });
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

  test('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(error),
    });
  });
});
