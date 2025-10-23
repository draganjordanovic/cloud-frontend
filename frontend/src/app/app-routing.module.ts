import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CreateArtistComponent } from './admin/create-artist/create-artist.component';
import { CreateSongComponent } from './admin/create-song/create-song.component';
import {DiscoverComponent} from './discover/discover.component';
import {AlbumDetailsComponent} from './album-details/album-details.component';
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {
  SignupConfirmationComponent
} from "./auth/signup-confirmation/signup-confirmation/signup-confirmation.component";
import { CreateAlbumComponent } from './admin/create-album/create-album.component';
import {UserLayoutComponent} from './user/user-layout/user-layout.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignupComponent},
  {path: 'sign-up-confirmation', component: SignupConfirmationComponent},
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'artists', component: CreateArtistComponent },
      { path: 'upload-music', component: CreateSongComponent },
      { path: 'upload-album', component: CreateAlbumComponent },
      { path: '', redirectTo: 'artists', pathMatch: 'full' }
    ]
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: 'discover', component: DiscoverComponent },
      { path: 'albums/:id', component: AlbumDetailsComponent },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
