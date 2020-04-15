import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromPhoto from '../../store/reducers/photo.reducer';
import { Store, select } from '@ngrx/store';
import { selectPhotosInfo } from 'src/app/store/selectors/photo.selectors';
import { loadPhotos } from 'src/app/store/actions/photo.actions';
import { map } from 'rxjs/operators';
import { PhotoDetailComponent } from '../photo-detail/photo-detail.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Photo } from 'src/app/models/photo';

@Component({
  selector: 'app-photo',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnDestroy {

  searchKey =''; 
  sub = this._store.pipe(select(selectPhotosInfo)).subscribe(o=>{
            this.pageOfItems = o.PhotosInfo;
            this.totalItems = o.count;
          });

  // array of all items to be paged
  items: Array<any>; 

  // current page of items
  pageOfItems: Array<any>; 
  currentPage: number = 1;
  readonly pageSize:number = 12;
  totalItems: number;
  totalPages : number;

  constructor(private _store: Store<fromPhoto.State>, public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  } 
  onKeydown(event) {
    if (event.key === "Enter") {
      this.currentPage = 1;
      this.search();
    }
  }

  onGoClick() {
    this.currentPage = 1;
    this.search();
  }

  search() {
    console.log(this.searchKey);
    this._store.dispatch(loadPhotos(
      { 
        key: this.searchKey.toLowerCase(),
        mediaType :"photo", //just process photo for now
        pageSize: this.pageSize,
        skipPage: this.currentPage - 1
      }));
  }

  onClickThumb(index) { 
    this.dialog.open(PhotoDetailComponent, {
      disableClose: true,
      data: { 
        index : index,
        pageOfItems : this.pageOfItems,
        pageSize : this.pageSize,
        currentPage : this.currentPage,
        searchKey : this.searchKey,
        totalPages : this.totalPages,
      },
      // width: "1200px",  no need to specify w/h, use up the space.
      // height: "800px", 
    }); 
  }

  onChangePage(event) {
    // update current page
    this.currentPage = event.newPage;
    this.totalPages = event.totalPages;
    this.search();
  }

}
