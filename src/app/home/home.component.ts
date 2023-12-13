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
  allMedia: Media[] = [];
  recommended: Media[] = [];
  trending: Media[] = [];
  mySwiper: Swiper | undefined;
  filteredArray: Media[] = [];
  searchTerm: string;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.fetchAllMedia().subscribe((media) => {
      this.allMedia = media;
    })

    this.mediaService.fetchHomePageMedia(true).subscribe((media) => {
      this.trending = media;
      this.initSwiper();
    })

    this.mediaService.fetchHomePageMedia(false).subscribe((media) => {
      this.recommended = media;
    });

    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    })

    // this.mediaService.searchValueSubject.subscribe((data) => {
    //   console.log(data);
    // })
  }

  searchResults() {
    this.filteredArray = this.allMedia.filter((media) => {
      return media.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  private initSwiper(): void {
    this.mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 3,
      spaceBetween: 40,
      // scrollbar: {
      //   el: '.swiper-scrollbar',
      //   draggable: true,
      //   dragSize: 'auto'
      // },
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
