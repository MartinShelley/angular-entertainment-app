import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private authStatusSubscription: Subscription | null = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log("ngOnInit app component");

    this.authStatusSubscription = this.authService.authState.subscribe((result) => {
      if (result === true) {
        this.router.navigate(['/home']);
        this.authStatusSubscription?.unsubscribe();
      } else if (result === false) {
        this.router.navigate(['/auth']);
        this.authStatusSubscription?.unsubscribe();
      }
    });

    this.authService.checkAuthenticationStatus();
  }
}
