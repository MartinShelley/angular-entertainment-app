import { Injectable, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./auth.service";

import { tap, take, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable({'providedIn': "root"})

export class AuthGuard{
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

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