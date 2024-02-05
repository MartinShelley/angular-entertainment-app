import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

import { take, switchMap, tap, map } from "rxjs/operators";
import { Observable, firstValueFrom, lastValueFrom, of } from "rxjs";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({'providedIn': "root"})

export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
  //   return this.authService.authState
  //   .pipe(
  //     take(1),
  //     tap(user => {
  //       if(user) {
  //         console.log("has user!");
  //         return true;
  //       }
  //       console.log("going auth");
  //       return this.router.navigate(['/auth']);
  //     })
  //   )
  // }

  async canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Promise<boolean> {
    
    const isUserLoggedIn = await lastValueFrom(this.authService.authState.pipe(take(1)));

    if(isUserLoggedIn) {
      return true;
    }
    else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | null> {
  //   return this.authService.user.pipe(map(user => !!user));
  // } 
}