type FacebookModel = {
  name: string;
  email: string;
  facebookId: string;
};

type AccountModel = {
  id?: string;
  name?: string;
};

export class FacebookAccount {
  id?: string;
  name: string;
  email: string;
  facebookId: string;

  constructor(fbModel: FacebookModel, accountModel?: AccountModel) {
    (this.id = accountModel?.id),
      (this.name = accountModel?.name ?? fbModel.name),
      (this.email = fbModel.email),
      (this.facebookId = fbModel.facebookId);
  }
}
