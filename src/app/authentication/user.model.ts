export class User {
  constructor(
    public userId: string,
    private _token: string,
    private _tokenExpiration: number
  ){}

  get token() {
    console.log("current time: ", new Date().getTime());
    console.log("token expiration: ", this._tokenExpiration);
    if(!this._tokenExpiration || new Date().getTime() > new Date(this._tokenExpiration).getTime()) {
      return null;
    }
    return this._token;
  }

  get tokenExpiration() {
    return this._tokenExpiration;
  }
}