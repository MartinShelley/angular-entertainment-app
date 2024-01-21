import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';

import { Media } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy  {
  allMedia: Media[] = [];
  recommended: Media[] = [];
  trending: Media[] = [];
  filteredArray: Media[] = [];
  searchTerm: string;
  isMobile: boolean;
  isTrendingLoading: boolean;
  isContentLoading: boolean;

  constructor(private mediaService: MediaService) {
    this.isTrendingLoading = true;
    this.isContentLoading = true;
  }
  
  ngOnInit(): void {
    this.mediaService.fetchHomePageMedia(true).subscribe((media) => {
      if(media.length > 0) {
        this.isTrendingLoading = false;
      }
      this.trending = media;
    });

    this.mediaService.fetchHomePageMedia(false).subscribe((media) => {
      if(media.length > 0) {
        this.isContentLoading = false;
      }
      this.recommended = media;
    });
    
    this.mediaService.mediaDataSubject.subscribe((media) => {
      this.allMedia = media;
    });
    
    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    });

    this.getIsMobile();
  }
  
  searchResults() {
    this.filteredArray = this.allMedia.filter((media) => {
      return media.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  getIsMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnDestroy(): void {
    if(this.searchTerm) {
      this.mediaService.resetSearch();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getIsMobile();
  }
}
