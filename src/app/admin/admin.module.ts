import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CreateArtistComponent } from './create-artist/create-artist.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [ AdminLayoutComponent, CreateArtistComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatToolbarModule,
    RouterModule
  ]
})
export class AdminModule {}
