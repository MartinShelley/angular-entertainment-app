import { Component, OnInit } from '@angular/core';
import { Media } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Media[] = [];

  constructor(private mediaService: MediaService){}

  ngOnInit(): void {
    this.mediaService.fetchMovies().subscribe((media) => {
      this.movies = media;
    })  
  }
}
