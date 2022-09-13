import axios from 'axios';
import { HttpClient } from '@/infra/http';

export class AxiosHttpClient {
  async get(args: HttpClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params });
    return result.data;
  }
}
