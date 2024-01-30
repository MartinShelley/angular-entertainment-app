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
    private router: Router,
  ) {}

  async ngOnInit(): Promise<any> {
    await this.waitForToken();
    this.listenForStateChanges();
    this.auth.onIdTokenChanged((response) => {
      console.log("onIDTokenChanged: ", response);
    })
  }


  /*
  Notes to check
  - Have another reread of the stackover page I saved. Could I get user token from the inteceptor before every request???
  - If I have onIdTokenChanged listening, what happens after I login and an hour has passed?
    - Will it trigger then can I then call getIdToken to get a new one?

  - If the above doesn't work as intended, explore using a timer then at the end of the timer, call getIdToken to get a new one

  - If all that doesn't work, then do auto logout.

  UPDATE!!!!!
  The timeout listener was not working as it was too long!!!!
  So - I need to set the time of the userId refresh into local storage, then when I pull that info, I need to check whether 
   a) If the time in localStorage is less than the time now, in which case it has expired
   b) If it has not expired, take the time from localStorage, work out how many minutes ago that was, then work out how many minutes
   are left before token expires, translate that to milliseconds and add to setTimeout!!



  */

  async waitForToken() {
    return new Promise<void>((resolve, reject) => {
      const storedDataAsString = localStorage.getItem('userData');
      if (storedDataAsString !== null) {
        console.log("I have data in local storage");
        const userData = JSON.parse(storedDataAsString);
        const hasSavedTokenExpired = new Date().getTime() > new Date(userData.tokenExpiration).getTime();
        if(hasSavedTokenExpired) {
          console.log("token has expried!!");
          const interval = setInterval(() => {
            console.log("inside interval");
            if(this.auth.currentUser) {
              console.log("found current user");
              clearInterval(interval);
              this.auth.currentUser.getIdToken().then((token) => {
                console.log("got new ID token");
                this.authService.assignUser(this.auth.currentUser!.uid, token, new Date(new Date().getTime() + 3600 * 1000));
                this.refreshTokenTimer(3600 * 1000);
                resolve();
              }).catch(reject);
            }
          }, 10);
        }
        else {
          console.log("token has NOT expired yet");
          this.authService.assignUser(userData.uuid, userData.token, userData.tokenExpiration);
          console.log("this is token expiration: ", userData.tokenExpiration)
          this.refreshTokenTimer(new Date(userData.tokenExpiration).getTime() - new Date().getTime());
          console.log(`we have ${new Date(new Date(userData.tokenExpiration).getTime() - new Date().getTime()).getMinutes()} minutes left for the token expiration`)
          resolve();
        }
      }
      else {
        resolve();
      }
    })
  }
  
  listenForStateChanges() {
    this.auth.onAuthStateChanged(user => {
      console.log("onAuthStageChanged!");
      if(user) {
        user.getIdToken().then((token) => {
          this.authService.assignUser(user.uid, token, new Date(new Date().getTime() + 3600 * 1000));
        });
      }
      else {
        this.authService.unassignUser();
        this.router.navigate(['/auth']);
      }
    })
  }

  refreshTokenTimer(expirationTimer: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      console.log("timout!!!!");
      this.auth.currentUser!.getIdToken().then((token) => {
        console.log("getting new ID Token!!");
        this.authService.assignUser(this.auth.currentUser!.uid, token, new Date(new Date().getTime() + 3600 * 1000));
        this.refreshTokenTimer(3600 * 1000); 
      })
    }, expirationTimer);
  }
}
