import { Component, OnInit } from '@angular/core';
import { Media } from '../media.model';
import { MediaService } from '../media.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Media[] = [];
  filteredArray: Media[] = [];
  searchTerm: string;

  constructor(private mediaService: MediaService, private router: Router){}

  ngOnInit(): void {
    this.mediaService.filterMedia('Movie').subscribe((media) => {
      this.movies = media;
    });
    
    this.mediaService.searchValueSubject.subscribe((term) => {
      this.searchTerm = term;
      this.searchResults();
    })
  }

  searchResults() {
    this.filteredArray = this.movies.filter((movie) => {
      return movie.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
}
