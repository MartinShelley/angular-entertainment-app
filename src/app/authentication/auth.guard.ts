import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

import { take, switchMap, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({'providedIn': "root"})

export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.authService.authState
    .pipe(
      take(1),
      tap(user => {
        if(user) {
          return true;
        }
        return this.router.navigate(['/auth']);
      })
    )
  }
}