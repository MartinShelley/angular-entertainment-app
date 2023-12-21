import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/media.model';
import { MediaService } from 'src/app/media.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit{
  @Input() content: Media;
  @Input() trending?: boolean;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
  }

  setBookmark(mediaDetail:any) {
    const mediaID = Number(mediaDetail.id);
    const newBookmarkValue = !mediaDetail.isBookmarked;

    this.mediaService.setBookmark(mediaID, newBookmarkValue)
    .subscribe(response => {
      if(response) {
        mediaDetail.isBookmarked = newBookmarkValue;
      }
    });
  }

}
