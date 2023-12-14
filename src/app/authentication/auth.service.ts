import { HttpClient } from "@angular/common/http";
import { Token } from "@angular/compiler";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken, onIdTokenChanged } from "firebase/auth";
import { BehaviorSubject, catchError, throwError, from } from "rxjs";
import { tap,  } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {
  user = new BehaviorSubject<Record<string, any> | null>(null);
  auth = getAuth();
  authState: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

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

  // private handleUserAuthentication(user: any) {
  //   user.getIdToken(false).then((token: string) => {
  //     this.authState.next(true);
  //     this.user.next({
  //       'email': user.email,
  //       'idToken': token
  //     });
  //   });
  // }

  checkAuthenticationStatus() {
    console.log("checkAuthStatus authService");
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        unsubscribe();
        resolve(user);
      },
      reject);
    })
  }
}