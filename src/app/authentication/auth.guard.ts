import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

import { take, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable({'providedIn': "root"})

export class AuthGuard{
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState
    .pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }
}