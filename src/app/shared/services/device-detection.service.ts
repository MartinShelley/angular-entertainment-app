import { Injectable, HostListener } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DeviceDetectionService {
  isMobile = new BehaviorSubject<boolean>(window.innerWidth < 768);

  constructor() {
    this.getIsMobile();
  }

  getIsMobile() {
    this.isMobile.next(window.innerWidth < 768 ? true : false);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.isMobile.next(window.innerWidth < 768 ? true : false);
  }
}