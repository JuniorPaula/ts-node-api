export class AccessToken {
  constructor(readonly value: string) {}

  static get expirationInMiliseconds(): number {
    return 30 * 60 * 1000;
  }
}
