import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Swiper } from 'swiper';
import { GalleryItem } from '@daelmaak/ngx-gallery';

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
  images: GalleryItem[];
  isMobile: boolean;

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

    this.isMobile = window.innerWidth < 768 ? true : false;
  }

  ngAfterViewInit(): void {
    // this.initSwiper();
  }
  
  searchResults() {
    this.filteredArray = this.allMedia.filter((media) => {
      return media.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.isMobile = window.innerWidth < 768 ? true : false;
  }

  // private initSwiper(): void {
  //   this.mySwiper = new Swiper('.swiper-container', {
  //     breakpoints: {
  //       320: {
  //         slidesPerView: 1.5,
  //         spaceBetween: 16
  //       },
  //       768: {
  //         slidesPerView: 1.5,
  //         // slidesPerGroup: 1,
  //         spaceBetween: 40
  //       },
  //       1024: {
  //         slidesPerView: 2.5,
  //         // slidesPerView: 3.75,
  //         spaceBetween: 40,
  //       }
  //     },
  //     // cssMode: true
  //     // slidesPerView: 'auto'
  //     // scrollbar: {
  //     //   el: '.swiper-scrollbar',
  //     //   draggable: true,
  //     //   dragSize: 'auto'
  //     // },
  //     // navigation: {
  //     //   nextEl: '.swiper-button-next',
  //     //   prevEl: '.swiper-button-prev'
  //     // },
  //     // pagination: {
  //     //   el: '.swiper-pagination',
  //     //   clickable: true
  //     // }
  //   });
  // }

  ngOnDestroy(): void {
    if(this.searchTerm) {
      this.mediaService.resetSearch();
    }

    // if(this.mySwiper) {
    //   this.mySwiper.destroy(true, true);
    // }
  }
}
