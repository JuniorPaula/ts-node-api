export interface HttpClient {
  get(parmas: HttpClient.Params): Promise<HttpClient.Result>;
}

export namespace HttpClient {
  export type Params = {
    url: string;
    params: object;
  };

  export type Result = any;
}
