// import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getAuth, signInWithRedirect, GithubAuthProvider, signInWithPopup  } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private provider = new GithubAuthProvider();

  // constructor(http: HttpClient) {}

  signUp() {
    console.log("hello");
  }

  gitHubLogin() {
    const auth = getAuth();
    // signInWithRedirect(auth, this.provider)
    signInWithPopup(auth, this.provider)
    .then((result) => {
      console.log(result);
    })
  }
}