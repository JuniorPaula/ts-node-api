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

export interface SaveFacebookAccountRepository {
  saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<SaveFacebookAccountRepository.Result>;
}

namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string;
    name: string;
    email: string;
    facebookId: string;
  };

  export type Result = {
    id: string;
  };
}
