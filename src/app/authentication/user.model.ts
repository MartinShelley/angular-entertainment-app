export class User {
  constructor(
    public userId: string,
    private _token: string,
    private _tokenExpirationDate: number
  ){}

  get token() {
    if(!this._tokenExpirationDate || new Date().getTime() > new Date(this._tokenExpirationDate).getTime()) {
      return null;
    }
    return this._token;
  }

  get tokenExpiration() {
    return this._tokenExpirationDate;
  }
}