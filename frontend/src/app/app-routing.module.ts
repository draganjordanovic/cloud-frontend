import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CreateArtistComponent } from './admin/create-artist/create-artist.component';
import { CreateSongComponent } from './admin/create-song/create-song.component';
import { CreateAlbumComponent } from './admin/create-album/create-album.component';

const routes: Routes = [
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
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
