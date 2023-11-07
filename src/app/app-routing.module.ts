import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { TvSeriesComponent } from './tv-series/tv-series.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { AuthenticationComponent } from './authentication/authentication.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'movies', component: MoviesComponent},
  {path: 'tv-shows', component: TvSeriesComponent},
  {path: 'bookmarks', component: BookmarksComponent},
  {path: 'auth', component: AuthenticationComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
