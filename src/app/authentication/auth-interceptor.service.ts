import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { take, exhaustMap, mergeMap } from "rxjs/operators";
import { getAuth } from "firebase/auth";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  auth = getAuth();

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user || user.token === null) {
          return next.handle(req);
        }

        const modifiedRequest = req.clone({ 
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(modifiedRequest);
        
      })
    )
  }


  // getCurrentIdToken() {
  //   return new Promise((resolve, reject) => {
  //     const unsubscribe = this.auth.onIdTokenChanged(user => {
  //       unsubscribe();
  //       if (user) {
  //         user.getIdToken().then(token => {
  //           resolve(token);
  //         });
  //       } else {
  //         reject(null);
  //       }
  //     }, reject);
  //   });
  // }
}