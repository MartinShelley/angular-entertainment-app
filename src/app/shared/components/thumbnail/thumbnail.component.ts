import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/shared/models/media.model';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})

export class ThumbnailComponent implements OnInit {
  @Input() content: Media;
  @Input() trending?: boolean;
  isBookmarked: boolean = false;
  
  constructor(private mediaService: MediaService) {}
  
  ngOnInit(): void {
    this.mediaService.bookmarksArray.subscribe((bookmarks) => {
      if(bookmarks) {
        bookmarks.forEach((bookmark) => {
          if(bookmark.id === this.content.id) {
            this.isBookmarked = true;
          }
        })
      }
    })
  }

  setBookmark(mediaDetail:any) {
    this.toggleIsBookmarked();
    const mediaID = Number(mediaDetail.id);
    if(this.isBookmarked) {
      this.mediaService.setBookmark(mediaID, mediaDetail).subscribe();
    }
    else {
      this.mediaService.deleteBookmark(mediaID).subscribe();
    }
  }

  toggleIsBookmarked() {
    this.isBookmarked = !this.isBookmarked;
  }
}
