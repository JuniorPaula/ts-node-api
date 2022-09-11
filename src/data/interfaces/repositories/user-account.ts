export interface LoadUserAccountRepository {
  load(params: LoadUserAccountRepository.Params): Promise<void>;
}

namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };
}
