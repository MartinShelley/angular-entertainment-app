import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getAuth, signInWithRedirect, GithubAuthProvider, signInWithPopup, onAuthStateChanged  } from "firebase/auth";
import { BehaviorSubject, catchError, throwError } from "rxjs";
import { tap } from "rxjs/operators";

import { firebaseConfig } from "src/environments/firebaseConfig";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userSubject = new BehaviorSubject<Record<string, any> | null>(null);
  // private token: any;
  private provider = new GithubAuthProvider();
  private auth = getAuth();
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<Record<string, any>>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
      catchError(error => throwError(() => error)), 
      tap(data => {
        this.userSubject.next({
          email: data['email'],
          idToken: data['idToken'],
          expiresIn: +data['expiresIn']
        })
      })
    );
  }

  signUp(email: string, password: string) {
    return this.http.post<Record<string, any>>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
      catchError(error => throwError(() => error)), 
      tap(data => {
        this.userSubject.next({
          email: data['email'],
          idToken: data['idToken'],
          expiresIn: +data['expiresIn']
        })
      })
    );
  }

  // gitHubLogin() {
  //   const auth = getAuth();
  //   // signInWithRedirect(auth, this.provider)
  //   signInWithPopup(auth, this.provider)
  //   .then((result) => {
  //     const credential = GithubAuthProvider.credentialFromResult(result);
  //     if (credential) {
  //       this.token = credential.accessToken;
  //       // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  //       console.log(credential);
  //     }
  //   })
  // }
}