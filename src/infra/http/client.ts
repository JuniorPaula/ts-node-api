/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpClient {
  get<T = any>(parmas: HttpClient.Params): Promise<T>;
}

export namespace HttpClient {
  export type Params = {
    url: string;
    params: object;
  };
}
