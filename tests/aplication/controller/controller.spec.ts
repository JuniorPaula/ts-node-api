import { ServerError } from '@/aplication/errors';
import { ValidationComposite } from '@/aplication/validations';
import { Controller } from '@/aplication/controller/controller';
import { HttpResponse } from '../helpers';

jest.mock('@/aplication/validations/composite');

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    body: 'any_data',
  };
  async perform(httpRequest: any): Promise<HttpResponse> {
    return this.result;
  }
}

describe('FacebookLoginController', () => {
  let sut: ControllerStub;

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new ControllerStub();
  });

  test('Should return 400 if token is empty', async () => {
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(new Error('validation_error')),
    }));

    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy);

    const httpResponse = await sut.handle('any_value');

    expect(ValidationComposite).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('validation_error'),
    });
  });

  test('Should return 500 if perform throws', async () => {
    const error = new Error('perform_error');
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);

    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(error),
    });
  });

  test('Should return sema result as perform', async () => {
    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual(sut.result);
  });
});
