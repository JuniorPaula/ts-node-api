import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { BadRequest, ServerError } from '@/aplication/errors';
import { badRequest, HttpResponse } from '@/aplication/helpers';

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (
        httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined
      ) {
        return badRequest(new BadRequest('token'));
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
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}
