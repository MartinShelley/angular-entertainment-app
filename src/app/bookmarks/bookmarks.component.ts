import { Component, OnInit } from '@angular/core';
import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})

export class BookmarksComponent implements OnInit{
  bookmarkedMovies: Media[] = [];
  bookmarkedTVSeries: Media[] = [];
  
  constructor(private mediaService: MediaService){}

  ngOnInit(): void {
    this.mediaService.fetchBookmarkedMedia('Movie').subscribe((media) => {
      this.bookmarkedMovies = media;
    })
    this.mediaService.fetchBookmarkedMedia('TV Series').subscribe((media) => {
      this.bookmarkedTVSeries = media;
    })
  }
}
