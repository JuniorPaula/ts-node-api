import { ServerError, Unauthorized } from '@/aplication/errors';

export type HttpResponse = { statusCode: number; body: any };

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new Unauthorized(),
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error),
});