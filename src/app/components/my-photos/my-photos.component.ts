import { Component, ViewChild, NgZone, OnInit} from '@angular/core';
import { PhotoListComponent } from '../photo-list/photo-list.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FolderFlatNode } from '../folder-tree/folder-database';
import { TokenService } from 'src/app/services/token.service';
import { PhotoService } from 'src/app/services/photo.service';
import { MatDialog } from '@angular/material';
import { GeneralDialogComponent, GeneralDialogData } from '../shared/general-dialog.component';

interface Folder {
  path: string;
  id: string;
}

@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.scss']
})
export class MyPhotosComponent implements OnInit {
  loggedIn = false;
  searchKey = '';
  folders: Folder[] = [];

  get paths(): string[] {
    return this.folders.map(p => p.path);
  }

  @ViewChild(PhotoListComponent) photoList: PhotoListComponent;

  constructor(private tokenService: TokenService, private photoService: PhotoService, private dialog: MatDialog) {}
  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.loggedIn =  token !== '' && token !== 'unauthorized';
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
     this.onGoClick();
    }
  }

  onGoClick() {
    this.photoList.currentPage = 1;
    this.photoList.search();
  }

  selectionChanged(selection: SelectionModel<FolderFlatNode>) {
    const folders = selection.selected.map(f => {
     return {path: f.path, id: f.id};
    });
    this.folders = folders;
  }


  markPrivate(): void {
    this.folders.forEach(p => {
      this.photoService.markPrivate(p.path).subscribe(o => {
        console.log(`all photos under ${o} makred private.`);
      },
        err => {
          console.log(err.message);
        });
    });
  }

  markPublic(): void {
    this.folders.forEach(p => {
      this.photoService.markPublic(p.path).subscribe(o => {
        console.log(`all photos under ${o} makred public.`);
      },
        err => {
          console.log(err.message);
        });
    });
  }

  movePhotos() {
    const checkedPhotos = this.photoList.pageOfItems.filter(p => p.isChecked).map(p => p.id);
    if (this.folders.length === 1 && checkedPhotos.length > 0) {
      const dlgalert = this.dialog.open(GeneralDialogComponent, {
        width: '450px',
        data: { yes: 'Yes',
          no: 'No',
          title: 'confirm',
          okOnly : false,
          message: `Are you sure you want to move ${checkedPhotos.length} photos to ${this.folders[0].path} ?` }
      });
      dlgalert.afterClosed().subscribe(ret => {
        if (ret === 'Yes') {
          this.MovePhotosCore(checkedPhotos);
        }
      });
    } else {
        this.dialog.open(GeneralDialogComponent, {
        width: '450px',
        data: { title: 'error', message: 'You need to select 1 folder and more than one photos to move.' }
      });
    }

  }

  private MovePhotosCore(checkedPhotos: string[]) {
    this.photoService.movePhotos(checkedPhotos, this.folders[0].id).subscribe(result => {
      const dlg = this.dialog.open(GeneralDialogComponent, {
        width: '450px',
        data: { title: 'success', message: result }
      });
      dlg.afterClosed().subscribe(_ => {
        this.onGoClick();
      });
    });
  }

}
