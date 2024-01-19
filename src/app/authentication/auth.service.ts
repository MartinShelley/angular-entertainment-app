import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { BehaviorSubject, catchError, throwError, from, Subject } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {
  user = new BehaviorSubject<Record<string, string> | null>(null);
  auth = getAuth();
  authState = new BehaviorSubject<boolean | null>(null);
  gitHubProvider = new GithubAuthProvider();
  errorMessage = new BehaviorSubject<string | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  login(email: string, password: string) {
    console.log("email from auth Service: ", email);
    console.log("password from auth Service: ", password);
    return from(signInWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      tap(response => {
        localStorage.setItem('returningUser', "true");
        response.user.getIdToken(false).then((token) => {
          this.user.next({
            'userId': response.user.uid,
            'token': token
          })
        })
      })
    )
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      tap(response => {
        response.user.getIdToken(false).then((token) => {
          this.user.next({
            'userId': response.user.uid,
            'token': token
          })
        })
        localStorage.setItem('returningUser', "true");
      })
    )
  }

  gitHubLogin() {
    signInWithRedirect(this.auth, this.gitHubProvider)
      .then((result) => {
        if(result) {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential!.accessToken;
          const userId = credential!.idToken

          this.user.next({
            'userId': userId!,
            'token': token!
          })
          localStorage.setItem('returningUser', "true");
        }
      })
  }

  handleErrors(errorCode: string) {
    let errorMessage;
    switch(errorCode) {
      case 'auth/invalid-login-credentials':
      case 'auth/invalid-email':
        errorMessage = 'Invalid login credentials.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'You have tried submitting too many requests. Please try again later.';
        break;
      case 'auth/email-already-exists':
        errorMessage = 'The email used already exists.';
        break;
      case 'auth/internal-error':
        errorMessage = 'An unknown error occurred.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is not strong enough, please use a stronger password.';
        break;
    }
    return errorMessage;
  }

  logout() {
    this.auth.signOut();
    localStorage.removeItem('returningUser');
  }
}