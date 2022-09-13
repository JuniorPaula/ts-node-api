export interface HttpClient {
  get(parmas: HttpClient.Params): Promise<void>;
}

export namespace HttpClient {
  export type Params = {
    url: string;
    params: object;
  };
}
