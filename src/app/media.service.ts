import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";

import { Media } from "./media.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class MediaService {
  mediaDataSubject = new BehaviorSubject<Media[]>([]);
  searchValueSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.fetchAllMedia().subscribe(data => this.mediaDataSubject.next(data));
  }

  fetchAllMedia() {
    return this.http.get<{ [key: number]: Media}>('https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/content.json')
    .pipe(map((responseData) => {
      const mediaArray = [];
      for(const key in responseData) {
        if(responseData.hasOwnProperty(key)) {
          mediaArray.push({...responseData[key], id: key});
        }
      }
      return mediaArray;
    }),
    catchError(error => {
      console.error('Failed to fetch data:', error);
      return [];
    }))
  }

  fetchMovies() {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.category === 'Movie'))
    );
  }

  fetchRecommended() {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isTrending === false))
    );
  }

  fetchTrending() {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isTrending === true))
    );
  }

  fetchTVShows() {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.category === 'TV Series'))
    );
  }

  fetchBookmarkedMovies() {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isBookmarked === true && media.category === 'Movie'))
    );
  }

  fetchBookmarkedTVSeries() {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isBookmarked === true && media.category === 'TV Series'))
    );
  }

  setBookmark(id: number, value: boolean): Observable<any> {
    return this.http.patch(`https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/content/${id}.json`, {
      "isBookmarked": value
    });
  }

  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
  }

}