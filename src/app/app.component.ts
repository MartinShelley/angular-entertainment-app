import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  auth = getAuth();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if(localStorage.getItem('returningUser')) {
      const interval = setInterval(() => {
        if(this.auth.currentUser) {
          clearInterval(interval);
          this.assignUser();
        }
      }, 500);
    }
    else {
      this.authService.authState.next(false);
      this.authService.user.next(null);
      this.router.navigate(['/auth']);
    }
    this.auth.onAuthStateChanged(user => {
      if(user) {
        this.assignUser();
      }
      else {
        this.authService.authState.next(false);
        this.router.navigate(['/auth']);
      }
    })
  }
  
  assignUser() {
    this.authService.authState.next(true);
    this.auth.currentUser!.getIdToken().then((token) => {
      this.authService.user.next({
        'userId': this.auth.currentUser!.uid,
        'token': token
      })
      this.router.navigate(['/home']);
    })  
  }
}