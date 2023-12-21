import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})

export class BookmarksComponent implements OnInit, OnDestroy{
  allMedia: Media[] = [];
  bookmarkedMovies: Media[] = [];
  bookmarkedTVSeries: Media[] = [];
  filteredMovies: Media[] = [];
  filteredTVSeries: Media[] = [];
  searchTerm: string;
  
  constructor(private mediaService: MediaService){}

  ngOnInit(): void {
    this.mediaService.fetchBookmarkedMedia('Movie').subscribe((media) => {
      this.bookmarkedMovies = media;
    })
    this.mediaService.fetchBookmarkedMedia('TV Series').subscribe((media) => {
      this.bookmarkedTVSeries = media;
    })
    this.mediaService.fetchAllMedia().subscribe((media) => {
      this.allMedia = media;
    });
    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    });
  }

  searchResults() {
    this.filteredMovies = this.bookmarkedMovies.filter((media) => {
      return media.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    this.filteredTVSeries = this.bookmarkedTVSeries.filter((media) => {
      return media.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  ngOnDestroy(): void {
    if(this.searchTerm) {
      this.mediaService.resetSearch();
    }
  }
}
