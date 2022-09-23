import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import {
  badRequest,
  HttpResponse,
  ok,
  serverError,
  unauthorized,
} from '@/aplication/helpers';
import { RequiredStringValidation } from '../validations/required-string';

type HttpRequest = {
  token: string;
};

type ModelResponse =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<ModelResponse>> {
    try {
      const error = this.validate(httpRequest);
      if (error !== undefined) {
        return badRequest(error);
      }

      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      } else {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error as Error);
    }
  }

  private validate(httpRequest: HttpRequest): Error | undefined {
    const validator = new RequiredStringValidation(httpRequest.token, 'token');
    return validator.validate();
  }
}
