import { mock, MockProxy } from 'jest-mock-extended';
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
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;

  beforeAll(() => {
    facebookAuth = mock();
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
});
