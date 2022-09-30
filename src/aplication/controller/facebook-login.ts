import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { HttpResponse, ok, unauthorized } from '@/aplication/helpers';
import { ValidationBuilder, Validatior } from '@/aplication/validations';

import { Controller } from './controller';

type HttpRequest = {
  token: string;
};

type ModelResponse =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse<ModelResponse>> {
    const accessToken = await this.facebookAuthentication.perform({
      token: httpRequest.token,
    });

    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized();
  }

  override buildValidators(httpRequest: HttpRequest): Validatior[] {
    const validators = ValidationBuilder.of({
      value: httpRequest.token,
      fieldName: 'token',
    })
      .required()
      .build();
    return validators;
  }
}
