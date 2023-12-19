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

  filterMedia(mediaType: string) {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.category === mediaType)      
    ))
  }

  fetchHomePageMedia(isTrending: boolean) {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isTrending === isTrending))
    );
  }

  fetchBookmarkedMedia(mediaType: string) {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isBookmarked === true && media.category === mediaType))
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

  resetSearch() {
    this.searchValueSubject.next('');
  }
}