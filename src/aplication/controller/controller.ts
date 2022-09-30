import { badRequest, HttpResponse, serverError } from '@/aplication/helpers';
import { Validatior } from '@/aplication/validations';
import { ValidationComposite } from '@/aplication/validations';

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>;
  buildValidators(httpRequest: any): Validatior[] {
    return [];
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error !== undefined) return badRequest(error);

    try {
      return await this.perform(httpRequest);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  private validate(httpRequest: any): Error | undefined {
    return new ValidationComposite(
      this.buildValidators(httpRequest),
    ).validate();
  }
}
