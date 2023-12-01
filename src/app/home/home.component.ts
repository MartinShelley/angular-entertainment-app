import { Component, OnInit } from '@angular/core';
import { Swiper } from 'swiper';
import { map } from 'rxjs/operators';

import { Media } from '../media.model';
import { MediaService } from '../media.service';

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
    this.mediaService.mediaDataSubject.
    pipe(
      map((data) => data.filter(media => media.isTrending === true))
    )
    .subscribe(((trendingMedia) => {
      this.trending = trendingMedia;
      if(this.trending.length > 2) {
        this.initSwiper();
      }
      console.log(this.trending);
    }));

    this.mediaService.fetchRecommended().subscribe((media) => {
      this.recommended = media;
    });

    // this.mediaService.searchValueSubject.subscribe((data) => {
    //   console.log(data);
    // })
  }

  private initSwiper(): void {
    this.mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      slidesPerView: 2.5,
      spaceBetween: 40,
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragSize: 'auto'
      },
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
