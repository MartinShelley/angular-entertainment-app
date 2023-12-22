import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ThumbnailComponent } from './shared/components/thumbnail/thumbnail.component';
import { SearchComponent } from './shared/components/search/search.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { GridSectionComponent } from './shared/components/grid-section/grid-section.component';
import { AuthInterceptorService } from './authentication/auth-interceptor.service';
import { MediaCategoryComponent } from './media-category/media-category.component';
import { MediaCategoryLabelPipe } from './shared/pipes/media-category-label.pipe';

//init swiper.js
register();

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    HomeComponent,
    MenuComponent,
    ThumbnailComponent,
    SearchComponent,
    BookmarksComponent,
    GridSectionComponent,
    MediaCategoryComponent,
    MediaCategoryLabelPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})

export class AppModule {

}
