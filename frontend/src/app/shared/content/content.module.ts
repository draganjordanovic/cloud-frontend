import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsComponent } from './albums/albums.component';
import { SinglesComponent } from './singles/singles.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';



@NgModule({
  declarations: [
    AlbumsComponent,
    SinglesComponent,
    AlbumDetailsComponent
  ],
  imports: [
    CommonModule
  ],
    exports: [AlbumsComponent]
})
export class ContentModule { }
