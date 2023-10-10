import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

import { Media } from "./media.model";

@Injectable({providedIn: 'root'})

export class MediaService {

  constructor(private http: HttpClient) {}

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
    }))
  }

  fetchTrending() {
    return this.fetchAllMedia().pipe(
      map((mediaArray) => mediaArray.filter(media => media.isTrending === true))
    );
  }
}