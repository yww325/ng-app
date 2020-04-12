import { Component, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Photo } from 'src/app/models/photo';
import * as fromPhoto from '../../store/reducers/photo.reducer';
import { Store, select } from '@ngrx/store';
import { loadPhotos } from 'src/app/store/actions/photo.actions';
import { selectPhotosInfo } from 'src/app/store/selectors/photo.selectors';
import { Subscription } from 'rxjs';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnDestroy {

  readonly fileBaseUrl:string = 'http://localhost/MyPhotos/File/';
  url: string;

  pageOfItems: any;
  index: any;
  readonly pageSize: any;
  currentPage: any;
  readonly searchKey: any; 
  sub :Subscription;
  readonly totalPages: any;
 

  constructor(private photoService: PhotoService,
  public dialogRef: MatDialogRef<PhotoDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pageOfItems = data.pageOfItems;
    this.index = data.index;
    this.pageSize = data.pageSize;
    this.currentPage = data.currentPage;
    this.searchKey = data.searchKey;
    this.totalPages = data.totalPages;
    this.SetUrl(); 
    console.log(this.url);
  }


  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    } 
  }

  
  private SetUrl() {
    let photo = this.pageOfItems[this.index];
    this.url = this.fileBaseUrl + photo.path.replace('\\', '/') + '/' + photo.fileName;
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
      this.searchKey, "photo",
      this.pageSize, (this.currentPage + direction - 1) * this.pageSize).subscribe(o => { 
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
}
 