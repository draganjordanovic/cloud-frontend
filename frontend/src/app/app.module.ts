import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { AlbumDetailsComponent } from './album-details/album-details.component';
import {MatList, MatListItem} from '@angular/material/list';
import {MatOption, MatSelect} from "@angular/material/select";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupConfirmationComponent } from './auth/signup-confirmation/signup-confirmation/signup-confirmation.component';
import {AuthInterceptor} from "./auth/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent,
    AlbumDetailsComponent,
    LoginComponent,
    SignupComponent,
    SignupConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    AdminModule,
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
    MatToolbar
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
