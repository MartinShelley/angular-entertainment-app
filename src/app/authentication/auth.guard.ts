import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

import { tap, take } from "rxjs/operators";

@Injectable({'providedIn': "root"})

export class AuthGuard {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService.userSubject.pipe(
      take(1),
      tap(user => {
      if(user) {
        return true;
      }
      else {
        this.router.navigate(['/auth']);
        return false;
      }
    }))
  }
}