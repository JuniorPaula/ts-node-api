import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    if (
      httpRequest.token === '' ||
      httpRequest.token === null ||
      httpRequest.token === undefined
    ) {
      return {
        statusCode: 400,
        body: new Error('The field token is required'),
      };
    }

    const result = await this.facebookAuthentication.perform({
      token: httpRequest.token,
    });

    if (result instanceof AccessToken) {
      return {
        statusCode: 200,
        body: {
          accessToken: result.value,
        },
      };
    } else {
      return {
        statusCode: 401,
        body: result,
      };
    }
  }
}

type HttpResponse = { statusCode: number; body: any };

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;

  beforeAll(() => {
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new FacebookLoginController(facebookAuth);
  });

  test('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });

  test('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });

  test('Should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });

  test('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'valid_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'valid_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  test('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 401,
      body: new AuthenticationError(),
    });
  });

  test('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        accessToken: 'any_value',
      },
    });
  });
});
