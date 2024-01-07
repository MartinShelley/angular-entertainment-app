import { Component } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  signOutToggle: boolean = false;

  constructor(private authService: AuthService) {}

  toggleSignOutModal() {
    this.signOutToggle = !this.signOutToggle;
  }

  signOut() {
    this.authService.logout();
  }
}
