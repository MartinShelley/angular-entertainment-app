import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './authentication/auth.guard';
import { MediaCategoryComponent } from './media-category/media-category.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'auth', component: AuthenticationComponent},
  {path: 'bookmarks', component: BookmarksComponent, canActivate: [AuthGuard]},
  {path: ':category', component: MediaCategoryComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
