import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { JwPaginationComponent } from './components/jw-pagination/jw-pagination.component';
import * as fromFolder from './store/reducers/folder.reducer';
import { FolderEffects } from './store/effects/folder.effects';
import { MyPhotosComponent } from './components/my-photos/my-photos.component';
import { FolderTreeComponent } from './components/folder-tree/folder-tree.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { TokenService } from './services/token.service';
import { TokenInterceptor } from './services/token-interceptor.service';
import { CreateNewFolderDialogComponent } from './components/folder-tree/create-new-folder-dialog.component';
import { GeneralDialogComponent } from './components/shared/general-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';


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
    JwPaginationComponent,
    MyPhotosComponent,
    FolderTreeComponent,
    CreateNewFolderDialogComponent,
    GeneralDialogComponent
  ],
  entryComponents: [
    PhotoDetailComponent,
    CreateNewFolderDialogComponent,
    GeneralDialogComponent
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
    EffectsModule.forFeature([UserEffects, PhotoEffects, PhotoEffects, FolderEffects]),
    BrowserAnimationsModule,   
    FormsModule,
    StoreModule.forFeature(fromPhoto.photoFeatureKey, fromPhoto.reducer),
    StoreModule.forFeature(fromFolder.folderFeatureKey, fromFolder.reducer),
     // Instrumentation must be imported after importing StoreModule (config is optional)
     StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states 
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    FlexLayoutModule
  ],
  providers: [
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
