import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { tap, take, exhaustMap, switchMap } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({ 
          params: new HttpParams().set('auth', user['idToken'])
        });
        return next.handle(modifiedRequest);
      })
    )
  }
}