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
  filteredArray: Media[] = [];
  searchTerm: string;
  
  constructor(private mediaService: MediaService){}

  ngOnInit(): void {
    this.mediaService.filterMedia('TV Series').subscribe((media) => {
      this.tvSeries = media;
    });

    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    })
  }

  searchResults() {
    this.filteredArray = this.tvSeries.filter((show) => {
      return show.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
}
