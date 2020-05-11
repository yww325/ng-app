import { Component, Inject, OnDestroy,ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Photo } from 'src/app/models/photo';
import * as fromPhoto from '../../store/reducers/photo.reducer';
import { Store, select } from '@ngrx/store';
import { loadPhotos } from 'src/app/store/actions/photo.actions';
import { selectPhotosInfo } from 'src/app/store/selectors/photo.selectors';
import { Subscription } from 'rxjs';
import { PhotoService } from 'src/app/services/photo.service';
import { environment } from '../../../environments/environment';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnDestroy, OnInit {

  @ViewChild("myPhoto") myPhoto: ElementRef<HTMLImageElement>;
  readonly fileBaseUrl:string = (environment.production ?"" :"http://localhost") + '/MyPhotos/File/';
  showSpinner: boolean =false;
  pageOfItems: any;
  index: any;
  readonly pageSize: any;
  currentPage: any;
  readonly searchKey: any; 
  sub :Subscription;
  readonly totalPages: any;
  paths : string[]
  mediaType : string; 
  videoUrl : string;
  loggedIn: boolean = false;

  constructor(private photoService: PhotoService,private tokenService : TokenService,
  public dialogRef: MatDialogRef<PhotoDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pageOfItems = data.pageOfItems;
    this.index = data.index;
    this.pageSize = data.pageSize;
    this.currentPage = data.currentPage;
    this.searchKey = data.searchKey;
    this.totalPages = data.totalPages;  
    this.paths = data.paths;
  }
  ngOnInit(): void {
    let token = this.tokenService.getToken();
    this.loggedIn =  token !== '' && token !== 'unauthorized';
    this.SetUrl();
  } 

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    } 
  }

  
  private SetUrl() {
    let photo = this.pageOfItems[this.index];  
    this.mediaType = photo.mediaType; 
    const searchRegExp = /\\/g;
    let url = this.fileBaseUrl + photo.path.replace(searchRegExp, '/') + '/' + photo.fileName;
    this.videoUrl = url; 

    if (this.mediaType ==="photo") {
           // https://blog.angular-university.io/angular-debugging/ for #myPhoto to get element
      setTimeout(()=>{
        this.showSpinner = true; 
        this.PreloadImage(url, ()=>{
            this.showSpinner = false;
        }); 
      });
    } 
  }

  private PreloadImage(url, callback){ 
    const img = this.myPhoto.nativeElement;
     img.src = url;
    if(img.complete){
      callback();
      img.onload=function(){};
    }
    else{
      img.onload = function() {
        callback();
        //    clear onLoad, IE behaves irratically with animated gifs otherwise
        img.onload=function(){};
      }
    }
  }

  closeModal(): void {
    this.dialogRef.close(); 
  } 

  plusSlides(direction: number): void { 
    if (this.index + direction >= this.pageOfItems.length || this.index + direction < 0) { 
      if (this.currentPage + direction <= 0 || this.currentPage + direction > this.totalPages) {
        // reach the edges, do nothing
        return;
      }
      this.switchPage(direction);
    } else {
      this.index +=direction;
      this.SetUrl();
    } 
  }

  switchPage(direction: number) {  
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }    
    this.sub = this.photoService.getPhotos(
      this.searchKey, 
      this.pageSize, (this.currentPage + direction - 1) * this.pageSize, this.paths).subscribe(o => { 
        if (o.value.length > 0) {
          this.pageOfItems = o.value; 
          this.index = direction === 1 ? 0 : o.value.length-1;
          this.currentPage = this.currentPage + direction;
          this.SetUrl();
        } else {
          // something wrong, no expected data, do nothing bug log.
          console.log(o);
        }
      });
  }

  markPrivateById()  {
      let photo = this.pageOfItems[this.index];
      this.photoService.markPrivateById(photo.id).subscribe(o=>{
        console.log(o);
      });
  }

  markPublicById() {
    let photo = this.pageOfItems[this.index];
    this.photoService.markPublicById(photo.id).subscribe(o=>{
      console.log(o);
    }); 
  }
}
 