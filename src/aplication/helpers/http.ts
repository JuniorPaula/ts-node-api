/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerError, Unauthorized } from '@/aplication/errors';

export type HttpResponse<T = any> = { statusCode: number; body: T };

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  body: new Unauthorized(),
});

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  body: new ServerError(error),
});
