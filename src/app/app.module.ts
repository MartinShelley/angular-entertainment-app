import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './shared/menu/menu.component';
import { ThumbnailComponent } from './shared/thumbnail/thumbnail.component';
import { SearchComponent } from './shared/search/search.component';
import { MoviesComponent } from './movies/movies.component';
import { TvSeriesComponent } from './tv-series/tv-series.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { GridSectionComponent } from './shared/grid-section/grid-section.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    HomeComponent,
    MenuComponent,
    ThumbnailComponent,
    SearchComponent,
    MoviesComponent,
    TvSeriesComponent,
    BookmarksComponent,
    GridSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

}
