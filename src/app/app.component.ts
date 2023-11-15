import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'entertainment-web-app';
  // isAuthPage: boolean = false;

  constructor(private location: Location, private router: Router) {
  //   console.log(this.router);
    console.log(location.path());
  }

  ngOnInit(): void {
  }
}
