import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsComponent } from './albums/albums.component';
import { SinglesComponent } from './singles/singles.component';



@NgModule({
  declarations: [
    AlbumsComponent,
    SinglesComponent
  ],
  imports: [
    CommonModule
  ],
    exports: [AlbumsComponent]
})
export class ContentModule { }
