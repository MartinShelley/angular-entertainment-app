import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';
import { DeviceDetectionService } from '../../services/device-detection.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isMobile: Subscription;
  signOutToggle: boolean = false;

  constructor(private authService: AuthService, private deviceDetectionService: DeviceDetectionService) {}

  ngOnInit(): void {
    this.isMobile = this.deviceDetectionService.isMobile.subscribe();
  }

  toggleSignOutModal() {
    this.signOutToggle = !this.signOutToggle;
  }

  signOut() {
    this.authService.logout();
  }
}
