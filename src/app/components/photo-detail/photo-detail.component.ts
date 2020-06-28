import { Component, Inject, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Photo } from 'src/app/models/photo';
import { Subscription } from 'rxjs';
import { PhotoService } from 'src/app/services/photo.service';
import { environment } from '../../../environments/environment';
import { TokenService } from 'src/app/services/token.service';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnDestroy, OnInit {

  @ViewChild('myPhoto') myPhoto: ElementRef<HTMLImageElement>;
  readonly fileBaseUrl: string = (environment.production ? '' : 'http://localhost') + '/MyPhotos/File/';
  showSpinner = false;
  pageOfItems: Photo[];
  index: any;
  readonly pageSize: any;
  currentPage: any;
  readonly searchKey: any;
  sub: Subscription;
  readonly totalPages: any;
  paths: string[];
  mediaType: string;
  videoUrl: string;
  loggedIn = false;
  isPrivate: boolean;
  isEdit = false;
  tagsInOneLine: string;

  constructor(private photoService: PhotoService,
              private tokenService: TokenService,
              public dialogRef: MatDialogRef<PhotoDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pageOfItems = data.pageOfItems;
    this.index = data.index;
    this.pageSize = data.pageSize;
    this.currentPage = data.currentPage;
    this.searchKey = data.searchKey;
    this.totalPages = data.totalPages;
    this.paths = data.paths;
  }
  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.loggedIn =  token !== '' && token !== 'unauthorized';
    this.SetUrl();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


  private SetUrl() {
    const photo = this.pageOfItems[this.index];
    this.isPrivate = photo.isPrivate;
    this.mediaType = photo.mediaType;
    this.tagsInOneLine = photo.tags.join();
    const searchRegExp = /\\/g;
    const url = this.fileBaseUrl + photo.path.replace(searchRegExp, '/') + '/' + photo.fileName;
    this.videoUrl = url;

    if (this.mediaType === 'photo') {
           // https://blog.angular-university.io/angular-debugging/ for #myPhoto to get element
      setTimeout(() => {
        this.showSpinner = true;
        this.PreloadImage(url, () => {
            this.showSpinner = false;
        });
      });
    }
  }

  private PreloadImage(url, callback) {
    const img = this.myPhoto.nativeElement;
    img.src = url;
    if (img.complete) {
      callback();
      img.onload = function() {};
    } else {
      img.onload = function() {
        callback();
        //    clear onLoad, IE behaves irratically with animated gifs otherwise
        img.onload = function() {};
      };
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
      this.index += direction;
      this.SetUrl();
    }
  }

  switchPage(direction: number) {
   this.reloadPageOfItems(direction, true);
  }

  private reloadPageOfItems(direction: number, changeIndex: boolean) {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    this.sub = this.photoService.getPhotos(
      this.searchKey,
      this.pageSize, (this.currentPage + direction - 1) * this.pageSize, this.paths).subscribe(o => {
        if (o.value.length > 0) {
          this.pageOfItems = o.value;
          if (changeIndex) {
            this.index = direction === 1 ? 0 : o.value.length - 1;
          }
          this.currentPage = this.currentPage + direction;
          this.SetUrl();
        } else {
          // something wrong, no expected data, do nothing bug log.
          console.log(o);
        }
      });
  }

  markPrivateById()  {
      const photo = this.pageOfItems[this.index];
      this.photoService.markPrivateById(photo.id).subscribe(o => {
         this.reloadPageOfItems(0, false);
      }, err => {console.log(err); });
  }

  markPublicById() {
    const photo = this.pageOfItems[this.index];
    this.photoService.markPublicById(photo.id).subscribe(o => {
      this.reloadPageOfItems(0, false);
    }, err => {console.log(err); });
  }

  editTags() {
    this.isEdit = true;
  }

  cancelEditTags() {
    this.isEdit = false;
    this.tagsInOneLine = this.pageOfItems[this.index].tags.join();
  }

  saveTags() {
    this.isEdit = false;
    const photo = this.pageOfItems[this.index];
    const newTags = this.tagsInOneLine.toLowerCase().split(',');
    this.photoService.updateTags(photo.id, newTags).subscribe(o => {
      this.reloadPageOfItems(0, false);
     }, err => {console.log(err); });
  }
}
