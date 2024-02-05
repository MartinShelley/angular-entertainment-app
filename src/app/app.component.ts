import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  tokenExpirationTimer: any;

  constructor(
    private authService: AuthService,
    // private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.autoLogin();
    // await this.waitForToken();
    this.authService.listenForStateChanges();
    this.auth.onIdTokenChanged((token) => {
      console.log("onIdTokenChanged!!");
      console.log("token from IdTokenChanged: ", token);
    })
  }


  /*
  Notes to check
  Now the issue is when a user signs in, then comes back to the site an hour later. Currently with the app the way it is, the auth guard fires too quickly before we've found the user/get new id so stuck on auth page
    - Can we delay the guard until we understand if user is signed in???
    - Or check for local storage, if user & expired, get new token then pass something to guard?



  UPDATE!!!!!
  The timeout listener was not working as it was too long!!!!
  So - I need to set the time of the userId refresh into local storage, then when I pull that info, I need to check whether 
   a) If the time in localStorage is less than the time now, in which case it has expired
   b) If it has not expired, take the time from localStorage, work out how many minutes ago that was, then work out how many minutes
   are left before token expires, translate that to milliseconds and add to setTimeout!!



  */

  // async waitForToken() {
  //   // return new Promise<void>((resolve, reject) => {
  //   const storedDataAsString = localStorage.getItem('userData');
  //   if(storedDataAsString !== null) {
  //     const userData = JSON.parse(storedDataAsString);
  //     this.authService.authState.next(true);
  //     // const hasSavedTokenExpired = new Date().getTime() > new Date(userData.tokenExpiration).getTime();
  //     // if(hasSavedTokenExpired) {
  //     const interval = setInterval(() => {
  //       if(this.authService.auth.currentUser) {
  //         clearInterval(interval);
  //         this.authService.getNewIdToken();
  //       }
  //     })
  //   }
  //   else {
  //     this.authService.authState.next(false);
  //   }
  // }
}
