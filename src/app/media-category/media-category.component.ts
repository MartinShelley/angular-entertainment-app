import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Media } from '../media.model';
import { MediaService } from '../media.service';
import { SearchComponent } from '../shared/components/search/search.component';

@Component({
  selector: 'app-media-category',
  templateUrl: './media-category.component.html',
  styleUrls: ['./media-category.component.scss']
})
export class MediaCategoryComponent implements OnInit, OnDestroy{
  @ViewChild(SearchComponent) searchComponent !: SearchComponent;
  urlSubscription: Subscription;
  category: string;
  categoryMedia: Media[] = [];
  filteredArray: Media[] = [];
  searchTerm: string;
  
  constructor(private mediaService: MediaService, private router: Router){
    this.urlSubscription = this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe((val) => {
      this.category = val.url.substring(1) === 'tv-series' ? 'TV Series' : 'Movie';

      if(this.searchTerm) {
        this.mediaService.resetSearch();
        this.searchComponent.resetSearchValue();
      }
     
      this.mediaService.getMediaByType(this.category).subscribe((media) => {
        this.categoryMedia = media;
      });
    });
  }
  
  ngOnInit(): void {  
    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    })
  }

  searchResults() {
    this.filteredArray = this.categoryMedia.filter((media) => {
      return media.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe();
  }
}


