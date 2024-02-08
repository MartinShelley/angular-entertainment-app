import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";

import { AuthService } from "../../authentication/auth.service";
import { Media } from "../models/media.model";
import { User } from "src/app/authentication/user.model";

@Injectable({providedIn: 'root'})

export class MediaService {
  user: User;
  mediaDataSubject = new BehaviorSubject<Media[]>([]);
  searchValueSubject = new BehaviorSubject<string>('');
  bookmarksArray = new BehaviorSubject<Media[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.auth.authStateReady().then(() => {
      this.authService.user.subscribe((user) => {
        this.user = user;
        this.resetMediaService(); //added this function in case users sign in via multiple logins
      });
    });
  }

  resetMediaService() {
    if (this.user) {
      this.fetchAllMedia().subscribe(data => this.mediaDataSubject.next(data));
      this.fetchBookmarkedMedia().subscribe((data) => {
        if(data) {
          this.bookmarksArray.next(data);
        } else {
          this.bookmarksArray.next([]);
        }
      });
    } else {
      this.mediaDataSubject.next([]);
      this.bookmarksArray.next([]);
    }
  }

  fetchAllMedia() {
    return this.http.get<{ [key: number]: Media}>('https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/content.json')
    .pipe(map((responseData) => {
      const mediaArray = [];
      for(const key in responseData) {
        if(responseData.hasOwnProperty(key)) {
          mediaArray.push({...responseData[key], id: Number(key) + 1});
        }
      }
      return mediaArray;
    }),
    catchError(error => {
      console.error('Failed to fetch data:', error);
      return [];
    }));
  }

  getMediaByType(mediaType: string) {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.category === mediaType)      
    ));
  }

  fetchHomePageMedia(isTrending: boolean) {
    return this.mediaDataSubject.pipe(
      map((data) => data.filter(media => media.isTrending === isTrending))
    );
  }

  fetchBookmarkedMedia() {
    return this.http.get<Media[]>(`https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/bookmarks/${this.user.userId}.json`)
    .pipe(
      map((response) => {
        if(!response) {
          return false;
        }
        return Object.values(response);
      })
    );
  }

  deleteBookmark(id: number) {
    this.bookmarksArray.next(this.bookmarksArray.getValue()?.filter((media) => media.id !== id));
    return this.http.delete(`https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/bookmarks/${this.user!.userId}/${id}.json`);
  }

  setBookmark(id: number, media: Media): Observable<any> {
    this.bookmarksArray.next(this.bookmarksArray.getValue()?.concat(media));
    return this.http.put(`https://angular-entertainment-app-default-rtdb.europe-west1.firebasedatabase.app/bookmarks/${this.user!.userId}/${id}.json`, media);
  }

  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
  }

  resetSearch() {
    this.searchValueSubject.next('');
  }
}