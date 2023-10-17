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
    this.mediaService.fetchBookmarkedMovies().subscribe((media) => {
      this.bookmarkedMovies = media;
    });
    
    this.mediaService.fetchBookmarkedTVSeries().subscribe((media) => {
      this.bookmarkedTVSeries = media;
    })
  }
}
