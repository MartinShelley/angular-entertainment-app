import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-media-category',
  templateUrl: './media-category.component.html',
  styleUrls: ['./media-category.component.scss']
})
export class MediaCategoryComponent implements OnInit{
  category: string;
  categoryMedia: Media[] = [];
  filteredArray: Media[] = [];
  searchTerm: string;
  
  constructor(private mediaService: MediaService, private router: Router){
    this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe((val) => {
      this.category = val.url.substring(1) === 'tv-series' ? 'TV Series' : 'Movie';
      
      this.mediaService.filterMedia(this.category).subscribe((media) => {
        console.log(this.category);
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
}


