import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Swiper } from 'swiper';

import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit  {
  allMedia: Media[] = [];
  recommended: Media[] = [];
  trending: Media[] = [];
  mySwiper: Swiper;
  filteredArray: Media[] = [];
  searchTerm: string;

  constructor(private mediaService: MediaService) {}
  
  ngOnInit(): void {
    this.mediaService.fetchHomePageMedia(true).subscribe((media) => {
      this.trending = media;
    });

    this.mediaService.fetchHomePageMedia(false).subscribe((media) => {
      this.recommended = media;
    });
    
    this.mediaService.fetchAllMedia().subscribe((media) => {
      this.allMedia = media;
    });
    
    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    });
  }

  ngAfterViewInit(): void {
    this.initSwiper();
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

  ngOnDestroy(): void {
    if(this.searchTerm) {
      this.mediaService.resetSearch();
    }

    if(this.mySwiper) {
      this.mySwiper.destroy(true, true);
    }
  }
}
