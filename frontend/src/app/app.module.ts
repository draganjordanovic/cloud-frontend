import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatAnchor, MatButton, MatButtonModule} from '@angular/material/button';
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardImage, MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { ContentModule } from './shared/content/content.module';
import {DiscoverComponent} from './discover/discover.component';
import {MatChipGrid, MatChipInput, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import {MatList, MatListItem} from '@angular/material/list';
import {MatOption, MatSelect} from "@angular/material/select";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupConfirmationComponent } from './auth/signup-confirmation/signup-confirmation/signup-confirmation.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { ArtistViewComponent } from './shared/artist-view/artist-view.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent,
    AlbumDetailsComponent,
    LoginComponent,
    SignupComponent,
    SignupConfirmationComponent,
    UserLayoutComponent,
    ArtistViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    AdminModule,
    ContentModule,
    MatLabel,
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
    MatList,
    MatListItem,
    MatSelect,
    MatOption,
    MatButton,
    MatToolbar,
    MatAnchor,
    MatProgressSpinner
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
