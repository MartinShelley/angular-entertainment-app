import { Component, OnInit } from '@angular/core';
import { Swiper } from 'swiper';

import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  trending: Media[] = [];
  private mySwiper: Swiper | undefined;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.fetchTrending().subscribe((media) => {
      this.trending = media;
      this.initSwiper();
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
