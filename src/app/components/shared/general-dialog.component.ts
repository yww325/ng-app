import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export class GeneralDialogData {
  yes = 'Ok';
  no = 'Cancel';
  title: string;
  message: string;
  okOnly = true;
}

@Component({
  selector: 'app-general-dialog',
  templateUrl: './general-dialog.component.html',
  styleUrls: []
})
export class GeneralDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<GeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GeneralDialogData) {
      this.data = Object.assign(new GeneralDialogData(), this.data);
    }
}
