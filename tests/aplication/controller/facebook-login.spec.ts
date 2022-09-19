import { mock } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: httpRequest.token });
    return {
      statusCode: 400,
      body: new Error('The field token is required'),
    };
  }
}

type HttpResponse = { statusCode: 400; body: any };

describe('FacebookLoginController', () => {
  test('Should return 400 if token is empty', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });

  test('Should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });

  test('Should return 400 if token is undefined', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });

  test('Should call FacebookAuthentication with correct params', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);
    await sut.handle({ token: 'valid_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'valid_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });
});
