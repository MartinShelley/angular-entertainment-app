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

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log("current user: ", this.auth.currentUser)
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => error)),
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

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
    .pipe(
      catchError(error => throwError(() => error)),
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
          console.log("result: ", result);

          this.user.next({
            'userId': userId!,
            'token': token!
          })
          localStorage.setItem('returningUser', "true");
        }
      })
  }

  logout() {
    this.auth.signOut();
    localStorage.removeItem('returningUser');
  }
}