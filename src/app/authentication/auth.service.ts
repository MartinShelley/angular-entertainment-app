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
  authState = new BehaviorSubject<boolean | null>(null);
  gitHubProvider = new GithubAuthProvider();
  errorMessage = new BehaviorSubject<string | null>(null);

  constructor(private router: Router) {}

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      // tap(response => {
      //   response.user.getIdToken().then((token) => {
      //     this.setUser(response.user.uid, token);
      //   })
      // })
    )
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => {
        return this.handleErrors(error.code);
      })),
      // tap(response => {
      //   response.user.getIdToken().then((token) => {
      //     this.setUser(response.user.uid, token);
      //   })
      // })
    )
  }

  async gitHubLogin() {
    try {
      await signInWithPopup(this.auth, this.gitHubProvider)
      // const result = await signInWithPopup(this.auth, this.gitHubProvider)
      // if(result) {
      //   console.log("result gitHubLogin: ", result);
      //   const credential = GithubAuthProvider.credentialFromResult(result);
      //   const userId = result.user.uid;
      //   const token = credential!.accessToken;
      //   console.log("token gitHub login: ", token);
      //   this.setUser(userId, token!)
      // }
    }
    catch (error){
      console.error(error)
    }
    return null;
  }

  handleErrors(errorCode: string) {
    console.log(errorCode);
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
    }
    return errorMessage;
  }

  // setUser(userId: string, token: string) {
  //   localStorage.setItem('returningUser', "true");
  //   // this.user.next({
  //   //   'userId': userId,
  //   //   'token': token
  //   // })
  //   console.log(this.user);
  // }

  logout() {
    this.auth.signOut();
    this.user.next(null);
    localStorage.removeItem('returningUser');
  }
}