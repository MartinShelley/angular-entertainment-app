import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { BehaviorSubject, catchError, throwError, from } from "rxjs";
import { tap,  } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user = new BehaviorSubject<Record<string, any> | null>(null);
  auth = getAuth();
  authState: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  constructor() {}

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => error)),
      tap(userCredential => {
        userCredential.user.getIdToken(false).then((token) => {
          this.authState.next(true);
          this.user.next({
            'email': userCredential.user.email,
            'idToken': token
          })
        })
      })
    )
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => error)),
      tap(userCredential => {
        userCredential.user.getIdToken(false).then((token) => {
          this.authState.next(true);
          this.user.next({
            'email': userCredential.user.email,
            'idToken': token
          })
        })
      })
    )
  }

  private handleUserAuthentication(user: any) {
    user.getIdToken(false).then((token: string) => {
      this.authState.next(true);
      this.user.next({
        'email': user.email,
        'idToken': token
      });
    });
  }

  checkAuthenticationStatus() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.handleUserAuthentication(user);
      }
      else {
        this.authState.next(false);
      }
    });
  }
}