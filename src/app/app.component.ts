import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  authStatusSubscription: Subscription | null = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log("ngOnInit app component");

    this.authService.checkAuthenticationStatus().then((user) => {
      console.log(user);
      if(user) {
        this.authService.authState.next(true);
        this.router.navigate(['/home']);
      }
      else {
        this.authService.authState.next(false);
        this.router.navigate(['/auth']);
      }
    });

  }
}
