import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

import { take } from "rxjs/operators";
import { lastValueFrom } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({'providedIn': "root"})

export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

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
}