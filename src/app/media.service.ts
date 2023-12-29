import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";

import { Media } from "./media.model";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "./authentication/auth.service";

@Injectable({providedIn: 'root'})

export class MediaService implements OnInit{
  user: Record<string, string> | null;
  mediaDataSubject = new BehaviorSubject<Media[]>([]);
  searchValueSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private authService: AuthService) {
    this.fetchAllMedia().subscribe(data => this.mediaDataSubject.next(data));
  }

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
      // console.log("subscribing to user in media service: ", this.user);
    })
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

  getMediaByType(mediaType: string) {
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
    // const userId = this.authService.user
    // return this.http.get(`https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/bookmarks/${this.authService}.json`)
    // .pipe(map((response) => {
    //   const bookmarksArray = [];

    // }))
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