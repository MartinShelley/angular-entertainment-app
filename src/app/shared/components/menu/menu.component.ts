import { Component, HostListener } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isMobile: boolean;
  signOutToggle: boolean = false;

  constructor(private authService: AuthService) {
    this.getIsMobile();
  }

  getIsMobile() {
    this.isMobile = window.innerWidth < 1023;
  }

  toggleSignOutModal() {
    this.signOutToggle = !this.signOutToggle;
  }

  signOut() {
    this.authService.logout();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getIsMobile();
  }
}
