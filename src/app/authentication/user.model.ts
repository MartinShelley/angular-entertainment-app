export class User {
  constructor(
    public userId: string,
    private _token: string,
    private _tokenExpiration: number
  ){}

  get token() {
    if(!this._tokenExpiration || new Date().getTime() > new Date(this._tokenExpiration).getTime()) {
      return null;
    }
    return this._token;
  }

  get tokenExpiration() {
    return this._tokenExpiration;
  }
}