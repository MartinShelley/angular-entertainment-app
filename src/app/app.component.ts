import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { Subscription } from 'rxjs';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  auth = getAuth();
  authStatusSubscription: Subscription | null = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

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
      this.router.navigate(['/auth']);
      this.auth.onAuthStateChanged(user => {
        console.log("onAuthStateChanged app component");
        if(user) {
          this.assignUser();
        }
        else {
          this.authService.authState.next(false);
          this.router.navigate(['/auth']);
        }
      })
    }
  }
  
  assignUser() {
    console.log("assign user app component");
    this.auth.currentUser!.getIdToken().then((token) => {
      this.authService.user.next({
        'userId': this.auth.currentUser!.uid,
        'token': token
      })
      this.authService.authState.next(true);
      this.router.navigate(['/home']);
    })  
  }
}