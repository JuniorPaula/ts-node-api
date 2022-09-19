class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      body: new Error('The field token is required'),
    };
  }
}

type HttpResponse = { statusCode: 400; body: any };

describe('FacebookLoginController', () => {
  test('Should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController();
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('The field token is required'),
    });
  });
});
