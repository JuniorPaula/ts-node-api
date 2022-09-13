import { AxiosHttpClient } from '@/http';

import axios from 'axios';

jest.mock('axios');

describe('AxiosHttpClient', () => {
  let url: string;
  let params: object;
  let fakeAxios: jest.Mocked<typeof axios>;
  let sut: AxiosHttpClient;

  beforeAll(() => {
    url = 'any_url';
    params = { any: 'any' };
    fakeAxios = axios as jest.Mocked<typeof axios>;
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  test('get', async () => {
    await sut.get({ url, params });

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
