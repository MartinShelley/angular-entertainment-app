import { Component, OnInit } from '@angular/core';
import { Swiper } from 'swiper';

import { Media } from '../media.model';
import { MediaService } from '../media.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recommended: Media[] = [];
  trending: Media[] = [];
  mySwiper: Swiper | undefined;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.fetchTrending().subscribe((media) => {
      this.trending = media;
      this.initSwiper();
    })

    this.mediaService.fetchRecommended().subscribe((media) => {
      this.recommended = media;
    })
  }

  private initSwiper(): void {
    this.mySwiper = new Swiper('.swiper-container', {
      // Swiper configuration options here
      slidesPerView: 2.5,
      spaceBetween: 40,
      // navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev'
      // },
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true
      // }
    });
  }
}
