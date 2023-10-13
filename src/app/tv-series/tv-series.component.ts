import { Component, OnInit } from '@angular/core';
import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-tv-series',
  templateUrl: './tv-series.component.html',
  styleUrls: ['./tv-series.component.scss']
})
export class TvSeriesComponent {
  tvSeries: Media[] = [];
  
  constructor(private mediaService: MediaService){}

  ngOnInit(): void {
    this.mediaService.fetchTVShows().subscribe((media) => {
      this.tvSeries = media;
    })  
  }

}
