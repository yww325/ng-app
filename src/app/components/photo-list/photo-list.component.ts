import { Component, OnDestroy, Input, OnChanges, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import * as fromPhoto from '../../store/reducers/photo.reducer';
import { Store, select } from '@ngrx/store';
import { selectPhotosInfo } from 'src/app/store/selectors/photo.selectors';
import { loadPhotos } from 'src/app/store/actions/photo.actions';
import { PhotoDetailComponent } from '../photo-detail/photo-detail.component';
import {MatDialog} from '@angular/material/dialog';
import { Photo } from 'src/app/models/photo';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnDestroy, AfterContentInit  {
  @Input() searchKey: string;
  @Input() paths: string[];
   currentPage = 1;
  cols = 4;

  gridByBreakpoint = {
    xl: 8,
    lg: 6,
    md: 4,
    sm: 2,
    xs: 1
  };

  photoSub = this.store.pipe(select(selectPhotosInfo)).subscribe(o => {
          // reconstruct javascript object so that the field isChecked is there(not if deserialize from json)
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
            this.pageOfItems = o.PhotosInfo.map(rawData => Object.assign(new Photo(), rawData));
            this.totalItems = o.count;
          });

  // current page of items
  pageOfItems: Array<Photo>;

  readonly pageSize: number = 12;
  totalItems: number;
  totalPages: number;

  constructor(private store: Store<fromPhoto.State>, public dialog: MatDialog,
              private mediaObserver: MediaObserver) { }

  ngOnDestroy(): void {
    this.photoSub.unsubscribe();
  }

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.cols = this.gridByBreakpoint[change.mqAlias];
    });
  }

  search() {
    console.log('search key: ' + this.searchKey + '  paths: ' + this.paths);
    this.store.dispatch(loadPhotos(
      {
        key: this.searchKey.toLowerCase(),
        pageSize: this.pageSize,
        skipPage: this.currentPage - 1,
        paths: this.paths
      }));
  }

  onClickThumb(index) {
    this.dialog.open(PhotoDetailComponent, {
      disableClose: true,
      data: {
        index,
        pageOfItems : this.pageOfItems,
        pageSize : this.pageSize,
        currentPage : this.currentPage,
        searchKey : this.searchKey,
        totalPages : this.totalPages,
        paths : this.paths,
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
