import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, throwError, from } from "rxjs";
import { tap } from "rxjs/operators";
import { getAuth, GithubAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { User } from "./user.model";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  fbAuthState = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<User | null>(null);
  auth = getAuth();
  authState = new BehaviorSubject<boolean>(false);
  gitHubProvider = new GithubAuthProvider();
  errorMessage: string;
  tokenExpirationTimer: ReturnType<typeof setTimeout>;

  constructor(private router: Router) {}

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      tap(() => {
        this.authState.next(true);
        this.getNewIdToken();
      })
    )
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      tap(() => {
        this.authState.next(true);
        this.getNewIdToken();
      })
    )
  }

  async gitHubLogin() {
    try {
      await signInWithPopup(this.auth, this.gitHubProvider);
      await this.getNewIdToken();
      this.authState.next(true);
    }
    catch (error){
      console.error(error)
    }
  }

  async autoLogin() {
    console.log("autoLogin");
    const dataStoredAsString = localStorage.getItem('userData');
    if(dataStoredAsString) {
      console.log("we have items in local storage");
      const userData = JSON.parse(dataStoredAsString);
      const loadedUser = new User(userData.userId, userData._token, userData._tokenExpiration);
      
      if(loadedUser.token) {
        console.log("token is still valid!!");
        this.authState.next(true);
        this.user.next(loadedUser);
        this.refreshTokenTimer(loadedUser.tokenExpiration);
      }
      else {
        console.log("token is no longer valid");
        this.getNewIdToken();
      }
    }
    else {
      return;
    }
  }

  getNewIdToken() {
    // return new Promise<void>((resolve) => {
      console.log("getNewIdToken");
      this.auth.authStateReady().then(() => {
        if(this.auth.currentUser) {
          console.log("found auth currentUser");
          this.auth.currentUser.getIdToken().then((token: string) => {
            console.log("fetched new Id");
            this.assignUser(this.auth.currentUser!.uid, token);
            this.refreshTokenTimer(3600 * 1000);
            // resolve();
          })
        }
      })
    // })
  }

  assignUser(userId: string, token: string) {
    console.log("assigning user");
    // this.authState.next(true);
    const tokenExpiration = new Date().getTime() + 3600 * 1000; //time an hour from now in milliseconds
    const user = new User(userId, token, tokenExpiration);
    this.user.next(user);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  // async isUserAuthenticated() {
  //   return this.authState;
  // }

  refreshTokenTimer(expirationTimer: number) {
    console.log("activating refreshTokenTimer");
    this.tokenExpirationTimer = setTimeout(() => {
      console.log("timeout");
      clearTimeout(this.tokenExpirationTimer);
      this.getNewIdToken();
    }, expirationTimer);
  }
  
  logout() {
    this.auth.signOut();
    this.unassignUser();
  }

  unassignUser() {
    this.authState.next(false);
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  handleErrors(errorCode: string) {
    switch(errorCode) {
      case "auth/email-already-in-use":
        this.errorMessage = 'The email you have used is already in use. Please sign up using a different email or attempt to login.';
        break;
      case 'auth/invalid-login-credentials':
      case 'auth/invalid-email':
        this.errorMessage = 'Invalid login credentials.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'You have tried submitting too many requests. Please try again later.';
        break;
      case 'auth/email-already-exists':
        this.errorMessage = 'The email used already exists.';
        break;
      case 'auth/internal-error':
        this.errorMessage = 'An unknown error occurred.';
        break;
      case 'auth/weak-password':
        this.errorMessage = 'Password is not strong enough, please use a stronger password.';
        break;
      case 'auth/popup-blocked':
        this.errorMessage = 'Popup is blocked. Please enable popups and refresh the page.';
        break;
    }
    return this.errorMessage;
  }
}