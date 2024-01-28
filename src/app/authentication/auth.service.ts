import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { getAuth, GithubAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { BehaviorSubject, catchError, throwError, from } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user = new BehaviorSubject<Record<string, string> | null>(null);
  auth = getAuth();
  authState = new BehaviorSubject<boolean>(false);
  gitHubProvider = new GithubAuthProvider();
  errorMessage = new BehaviorSubject<string | null>(null);

  constructor(private router: Router) {}

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      tap(response => {
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
      tap(response => {
        this.router.navigate(['/home']);
      })
    )
  }

  async gitHubLogin() {
    try {
      await signInWithPopup(this.auth, this.gitHubProvider)
      .then(() => {
        this.router.navigate(['/home']);
      })
    }
    catch (error){
      console.error(error)
    }
    return null;
  }

  assignUser(userId: string, token: string) {
    console.log("assigning user authService");
    this.authState.next(true);
    this.user.next({
      userId: userId,
      token: token
    });

    const tokenExpiration = new Date().getTime() + 3600 * 1000;
    const userData = {
      returningUser: "true",
      uuid: userId,
      token: token,
      tokenExpiration: tokenExpiration
    }

    localStorage.setItem('userData', JSON.stringify(userData));
  }

  unassignUser() {
    this.authState.next(false);
    this.user.next(null);
    localStorage.removeItem('userData');
  }

  // refreshUserToken(): Promise<string> {
  //   console.log("refreshing user token from auth service");
  //   const currentUser = this.auth.currentUser;
  
  //   if (currentUser) {
  //     return currentUser.getIdToken(true);
  //   } else {
  //     // Handle the case when currentUser is null
  //     return Promise.reject(new Error('Current user is null'));
  //   }
  // }

  handleErrors(errorCode: string) {
    let errorMessage;
    switch(errorCode) {
      case "auth/email-already-in-use":
        errorMessage = 'The email you have used is already in use. Please sign up using a different email or attempt to login.';
        break;
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
      case 'auth/popup-blocked':
        errorMessage = 'Popup is blocked. Please enable popups and refresh the page.';
        break;
    }
    return errorMessage;
  }

  logout() {
    this.auth.signOut();
    this.unassignUser();
  }
}