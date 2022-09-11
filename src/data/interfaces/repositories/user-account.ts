export interface LoadUserAccountRepository {
  load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result>;
}

namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface CreateFacebookAccountRepository {
  createFromFacebook(
    params: CreateFacebookAccountRepository.Params,
  ): Promise<void>;
}

namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string;
    email: string;
    facebookId: string;
  };
}

export interface UpdateFacebookAccountRepository {
  updateWithFacebook(
    params: UpdateFacebookAccountRepository.Params,
  ): Promise<void>;
}

namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string;
    name: string;
    facebookId: string;
  };
}
