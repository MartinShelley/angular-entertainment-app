import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

import { take } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({'providedIn': "root"})

export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Promise<boolean> {
    
    const isUserLoggedIn = await lastValueFrom(this.authService.authState.pipe(take(1)));
    console.log("authGuard: ", isUserLoggedIn);

    if(isUserLoggedIn) {
      return true;
    }
    else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}