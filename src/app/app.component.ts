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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const storedDataAsString = localStorage.getItem('userData');
    if (storedDataAsString !== null) {
      console.log("I have data in local storage");
      const userData = JSON.parse(storedDataAsString);
      const hasSavedTokenExpired = new Date().getTime() > userData.tokenExpiration;
      if(!hasSavedTokenExpired) {
        console.log("token has NOT expired yet");
        this.authService.assignUser(userData.uuid, userData.token);
      }
      else {
        console.log("token has expried!!");
        const interval = setInterval(() => {
          console.log("inside interval");
          if(this.auth.currentUser) {
            console.log("found current user");
            clearInterval(interval);
            this.auth.currentUser.getIdToken().then((token) => {
              console.log("got new ID token");
              this.authService.assignUser(this.auth.currentUser!.uid, token);
            })
          }
        }, 50);
      }
    }

    this.auth.onAuthStateChanged(user => {
      console.log("onAuthStageChanged!");
      if(user) {
        // if(!localStorage.getItem('token')) {
          user.getIdToken().then((token) => {
            this.authService.assignUser(user.uid, token);
          });
        // }
      }
      else {
        this.authService.unassignUser();
        this.router.navigate(['/auth']);
      }
    })
  }
}
