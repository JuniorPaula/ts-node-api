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
  token: string | undefined | null;
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
      if (
        httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined
      ) {
        return badRequest(new BadRequest('token'));
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
}
