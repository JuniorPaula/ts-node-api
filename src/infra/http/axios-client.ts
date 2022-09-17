import axios from 'axios';
import { HttpClient } from './client';

export class AxiosHttpClient implements HttpClient {
  async get<T = any>(args: HttpClient.Params): Promise<T> {
    const result = await axios.get(args.url, { params: args.params });
    return result.data;
  }
}
