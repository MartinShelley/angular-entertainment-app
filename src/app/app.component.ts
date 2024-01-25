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
    if (localStorage.getItem('returningUser')) {
      const userId = localStorage.getItem('uuid');
      const token = localStorage.getItem('token');
      this.authService.assignUser(userId!, token!);
    }
    else {
      this.authService.unassignUser();
      this.router.navigate(['/auth']);
    }

    this.auth.onAuthStateChanged(user => {
      if(user) {
        if(!localStorage.getItem('token')) {
          user.getIdToken().then((token) => {
            this.authService.assignUser(user.uid, token);
          });
        }
      }
      else {
        this.authService.unassignUser();
        this.router.navigate(['/auth']);
      }
    })
  }
}
