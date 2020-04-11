import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { StoreModule } from '@ngrx/store';
import * as fromUser from './store/reducers/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';
import { UsersComponent } from './components/users/users.component';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromPhoto from './store/reducers/photo.reducer';
import { PhotoEffects } from './store/effects/photo.effects';
import { PhotoDetailComponent } from './components/photo-detail/photo-detail.component';
import { DemoMaterialModule } from './demo-material-module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    ContactComponent,
    HomeComponent,
    UsersComponent,
    PhotoListComponent,
    PhotoDetailComponent,    
  ],
  entryComponents: [
    PhotoDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(fromUser.userFeatureKey, fromUser.reducer),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UserEffects, PhotoEffects, PhotoEffects]),
    BrowserAnimationsModule,   
    FormsModule,
    StoreModule.forFeature(fromPhoto.photoFeatureKey, fromPhoto.reducer)
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
