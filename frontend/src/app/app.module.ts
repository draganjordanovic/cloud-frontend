import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatButton, MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardImage, MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import {DiscoverComponent} from './discover/discover.component';
import {MatChipGrid, MatChipInput, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        RouterModule,
        AdminModule,
        MatLabel,
        MatToolbar,
        MatCard,
        MatFormField,
        MatChipGrid,
        MatChipRow,
        MatCardContent,
        MatIcon,
        MatChipInput,
        ReactiveFormsModule,
        MatCardImage,
        NgOptimizedImage,
        MatInput,
        MatButton
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
