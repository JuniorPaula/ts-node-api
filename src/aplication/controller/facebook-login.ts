import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { BadRequest } from '@/aplication/errors';
import {
  badRequest,
  HttpResponse,
  ok,
  serverError,
  unauthorized,
} from '@/aplication/helpers';

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
    if (
      httpRequest.token === '' ||
      httpRequest.token === null ||
      httpRequest.token === undefined
    ) {
      return new BadRequest('token');
    }
  }
}
