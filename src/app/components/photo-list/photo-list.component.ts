import { Component, OnInit } from '@angular/core';
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
export class PhotoListComponent implements OnInit {

  searchKey =''; 
  photos$ = this._store.pipe(select(selectPhotosInfo))
          .pipe(map(a => this.filterPhotoType(a)));


  constructor(private _store: Store<fromPhoto.State>, public dialog: MatDialog) { }

  filterPhotoType(a : Photo[]) : Photo[]{
   return a.filter(p=>p.mediaType =='photo');
  }

  ngOnInit() { 
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }

  search() {
    console.log(this.searchKey);
    this._store.dispatch(loadPhotos({ key: this.searchKey.toLowerCase()}));
  }

  onClickThumb(photo) {
    this.dialog.open(PhotoDetailComponent, {
      disableClose: true,
      data: photo,
      width: "1300px",
      height: "980px", 
    });
    
  }

}
