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
        this.getNewIdToken();
        this.router.navigate(['/home']);
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
        this.getNewIdToken();
        this.router.navigate(['/home']);
      })
    )
  }

  async gitHubLogin() {
    try {
      await signInWithPopup(this.auth, this.gitHubProvider);
      this.getNewIdToken();
      this.router.navigate(['/home']);
    }
    catch (error){
      console.error(error)
    }
  }

  getNewIdToken() {
    console.log("getNewIdToken");
    const interval = setInterval(() => {
      if(this.auth.currentUser) {
        clearInterval(interval);
        this.auth.currentUser!.getIdToken().then((token: string) => {
          this.assignUser(this.auth.currentUser!.uid, token);
          this.refreshTokenTimer(3600 * 1000);
        });
      }
    }, 10);
  }

  assignUser(userId: string, token: string) {
    this.authState.next(true);
    const tokenExpiration = new Date().getTime() + 3600 * 1000; //time an hour from now in milliseconds
    const user = new User(userId, token, tokenExpiration);
    this.user.next(user);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  refreshTokenTimer(expirationTimer: number) {
    console.log("refreshTokenTimer");
    this.tokenExpirationTimer = setTimeout(() => {
      console.log("timeout");
      this.getNewIdToken();
    }, expirationTimer);
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

  async autoLogin() {
    const dataStoredAsString = localStorage.getItem('userData');
    if(dataStoredAsString) {
      const userData = JSON.parse(dataStoredAsString);
      const loadedUser = new User(userData.userId, userData._token, userData._tokenExpiration);
      console.log(loadedUser);
      
      if(loadedUser.token) {
        console.log("got token!!");
        this.authState.next(true);
        const user = new User(loadedUser.userId, loadedUser.token, loadedUser.tokenExpiration)
        this.user.next(user);
        this.refreshTokenTimer(loadedUser.tokenExpiration);
      }

      else {
        this.getNewIdToken();
      }
    }
    else {
      return;
    }
  }

  logout() {
    this.auth.signOut();
    this.unassignUser();
  }

  listenForStateChanges() {
    this.auth.onAuthStateChanged(user => {
      console.log("onAuthStageChanged!");
      // if(user) {
      //   user.getIdToken().then((token) => {
      //     this.assignUser(user.uid, token);
      //   });
      // }
      if(!user) {
        this.unassignUser();
        this.router.navigate(['/auth']);
      }
    })
  }

}