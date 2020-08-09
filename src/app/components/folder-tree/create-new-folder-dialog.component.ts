import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface DialogData {
  parentPath: string;
  folderName: string;
}

@Component({
  selector: 'app-create-new-folder-dialog',
  templateUrl: './create-new-folder-dialog.component.html'
})
export class CreateNewFolderDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateNewFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onCanelClick(): void {
    this.dialogRef.close();
  }
}
