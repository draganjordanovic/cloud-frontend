import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CreateArtistComponent } from './admin/create-artist/create-artist.component';
import { CreateSongComponent } from './admin/create-song/create-song.component';
import {DiscoverComponent} from './discover/discover.component';
import {AlbumDetailsComponent} from './album-details/album-details.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'artists', component: CreateArtistComponent },
      { path: 'upload-music', component: CreateSongComponent },
      // { path: 'upload-album', component: UploadAlbumComponent },
      { path: '', redirectTo: 'artists', pathMatch: 'full' }
    ]
  },
  { path: 'discover', component: DiscoverComponent },
  { path: 'albums/:id', component: AlbumDetailsComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
