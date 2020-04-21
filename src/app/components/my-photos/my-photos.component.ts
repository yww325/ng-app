import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromFolder from '../../store/reducers/folder.reducer';
import { Store, select } from '@ngrx/store';
import { loadFolders } from 'src/app/store/actions/folder.actions';
import { selectFolders } from 'src/app/store/selectors/folder.selectors';
import { Folder } from 'src/app/models/folder';


@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.scss']
})
export class MyPhotosComponent implements OnInit, OnDestroy {

  folderSub = this._store.pipe(select(selectFolders)).subscribe(folders=>{
    this.folders = folders;
  });

  folders: Array<Folder>;
  
  constructor(private _store: Store<fromFolder.State>) { } 

  ngOnDestroy(): void {
    this.folderSub.unsubscribe();
  }

  ngOnInit(): void {
    this._store.dispatch(loadFolders());
  }

}
