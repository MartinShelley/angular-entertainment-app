import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { TvSeriesComponent } from './tv-series/tv-series.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './authentication/auth.guard';
import { MediaCategoryComponent } from './media-category/media-category.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'auth', component: AuthenticationComponent},
  {path: 'bookmarks', component: BookmarksComponent, canActivate: [AuthGuard]},
  // {path: 'movies', component: MoviesComponent, canActivate: [AuthGuard]},
  // {path: 'tv-shows', component: TvSeriesComponent, canActivate: [AuthGuard]},
  {path: ':category', component: MediaCategoryComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
