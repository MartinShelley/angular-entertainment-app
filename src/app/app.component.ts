// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
// import { Subscription, filter, map } from 'rxjs';
// import { AuthService } from './authentication/auth.service';
// import { getAuth } from 'firebase/auth';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent implements OnInit{
//   auth = getAuth();
//   urlSubscription: Subscription;
//   targetedUrlPath: string;

//   constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.urlSubscription = this.router.events
//     .pipe(filter((event: any) => event instanceof NavigationStart))
//     .subscribe((val) => {
//       this.targetedUrlPath = val.url;
//     })

//     if(localStorage.getItem('returningUser')) {
//       const interval = setInterval(() => {
//         if(this.auth.currentUser) {
//           this.router.navigate([this.targetedUrlPath]);
//           clearInterval(interval);
//           this.assignUser();
//         }
//       }, 500);
//     }
//     else {
//       this.authService.authState.next(false);
//       this.authService.user.next(null);
//       this.router.navigate(['/auth']);
//     }
//     this.auth.onAuthStateChanged(user => {
//       if(user) {
//         this.assignUser();
//         this.router.navigate(['/home']);
//       }
//       else {
//         this.authService.authState.next(false);
//         this.router.navigate(['/auth']);
//       }
//     })
//   }
  
//   assignUser() {
//     this.authService.authState.next(true);
//     localStorage.setItem('returningUser', "true");
//     // this.router.navigate(['/home']);
//     this.auth.currentUser!.getIdToken().then((token) => {
//       this.authService.user.next({
//         'userId': this.auth.currentUser!.uid,
//         'token': token
//       })
//     })  
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from './authentication/auth.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  auth = getAuth();
  urlSubscription: Subscription;
  targetedUrlPath: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.urlSubscription = this.router.events
      .pipe(filter((event: any) => event instanceof NavigationStart))
      .subscribe((val) => {
        this.targetedUrlPath = val.url;
      });

    if (localStorage.getItem('returningUser')) {
      const userId = localStorage.getItem('uuid');
      const token = localStorage.getItem('token');
      this.authService.assignUser(userId!, token!);
      

      const interval = setInterval(() => {
        if(this.targetedUrlPath !== "") {
          clearInterval(interval);
          this.router.navigate([this.targetedUrlPath]);
        }
      }, 50);
    }
    else {
      this.authService.unassignUser();
      this.router.navigate(['/auth']);
    }

    this.auth.onAuthStateChanged(user => {
      if(user) {
        user.getIdToken().then((token) => {
          this.authService.assignUser(user.uid, token);
        });
        this.router.navigate([this.targetedUrlPath]);
      }
      else {
        this.authService.unassignUser();
        this.router.navigate(['/auth']);
      }
    })
  }
}
