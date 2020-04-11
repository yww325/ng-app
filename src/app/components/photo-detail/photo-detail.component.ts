import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Photo } from 'src/app/models/photo';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent {

  readonly  fileBaseUrl:string = 'http://localhost/MyPhotos/File/';
  url: string;
  constructor(
    public dialogRef: MatDialogRef<PhotoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Photo) {

      this.url = this.fileBaseUrl + data.path.replace('\\','/') + '/' + data.fileName;
      console.log(this.url);
    }

    closeModal(): void {
      this.dialogRef.close();
  } 
}
 