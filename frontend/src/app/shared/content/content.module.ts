import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsComponent } from './albums/albums.component';
import { SinglesComponent } from './singles/singles.component';
import { AlbumViewComponent } from './album-details/album-view.component';



@NgModule({
  declarations: [
    AlbumsComponent,
    SinglesComponent,
    AlbumViewComponent
  ],
  imports: [
    CommonModule
  ],
    exports: [AlbumsComponent]
})
export class ContentModule { }
