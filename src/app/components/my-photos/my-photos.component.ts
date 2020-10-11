import { Component, ViewChild, NgZone, OnInit } from "@angular/core";
import { PhotoListComponent } from "../photo-list/photo-list.component";
import { SelectionModel } from "@angular/cdk/collections";
import { FolderFlatNode } from "../folder-tree/folder-database";
import { TokenService } from "src/app/services/token.service";
import { PhotoService } from "src/app/services/photo.service";
import { MatDialog } from "@angular/material/dialog";
import {
  GeneralDialogComponent,
  GeneralDialogData,
} from "../shared/general-dialog.component";

interface Folder {
  path: string;
  id: string;
}

@Component({
  selector: "app-my-photos",
  templateUrl: "./my-photos.component.html",
  styleUrls: ["./my-photos.component.scss"],
})
export class MyPhotosComponent implements OnInit {
  loggedIn = false;
  searchKey = "";
  folders: Folder[] = [];

  get paths(): string[] {
    return this.folders.map((p) => p.path);
  }

  @ViewChild(PhotoListComponent) photoList: PhotoListComponent;

  constructor(
    private tokenService: TokenService,
    private photoService: PhotoService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.loggedIn = token !== "" && token !== "unauthorized";
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.onGoClick();
    }
  }

  onGoClick() {
    this.photoList.currentPage = 1;
    this.photoList.search();
  }

  selectionChanged(selection: SelectionModel<FolderFlatNode>) {
    const folders = selection.selected.map((f) => {
      return { path: f.path, id: f.id };
    });
    this.folders = folders;
  }

  markPrivate(): void {
    this.folders.forEach(async (p) => {
      const folder = await this.photoService
        .markPrivate(p.path)
        .toPromise()
        .catch((err) => {
          console.log(err);
        });
      console.log(`all photos under ${folder} makred private.`);
    });
  }

  markPublic(): void {
    this.folders.forEach(async (p) => {
      const folder = this.photoService
        .markPublic(p.path)
        .toPromise()
        .catch((err) => {
          console.log(err);
        });
      console.log(`all photos under ${folder} makred public.`);
    });
  }

  async movePhotosAsync() {
    const checkedPhotos = this.photoList.pageOfItems
      .filter((p) => p.isChecked)
      .map((p) => p.id);
    if (this.folders.length === 1 && checkedPhotos.length > 0) {
      const dlgalert = this.dialog.open(GeneralDialogComponent, {
        width: "450px",
        data: {
          yes: "Yes",
          no: "No",
          title: "confirm",
          okOnly: false,
          message: `Are you sure you want to move ${checkedPhotos.length} photos to ${this.folders[0].path} ?`,
        },
      });
      const ret = await dlgalert.afterClosed().toPromise();
      if (ret === "Yes") {
        this.MovePhotosCoreAsync(checkedPhotos);
      }
    } else {
      this.dialog.open(GeneralDialogComponent, {
        width: "450px",
        data: {
          title: "error",
          message:
            "You need to select 1 folder and more than one photos to move.",
        },
      });
    }
  }

  private async MovePhotosCoreAsync(checkedPhotos: string[]) {
    const result = await this.photoService
      .movePhotos(checkedPhotos, this.folders[0].id)
      .toPromise()
      .catch((err) => {
        console.log(err);
      });
    const dlg = this.dialog.open(GeneralDialogComponent, {
      width: "450px",
      data: { title: "success", message: result },
    });
    await dlg.afterClosed().toPromise();
    this.onGoClick();
  }
}
