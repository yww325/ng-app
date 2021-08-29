import {
  Component,
  Inject,
  ElementRef,
  ViewChild,
  OnInit,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Photo } from "src/app/models/photo";
import { PhotoService } from "src/app/services/photo.service";
import { environment } from "../../../environments/environment";
import { select, Store } from "@ngrx/store";
import * as fromPhoto from "../../store/reducers/photo.reducer";
import { loadPhotos } from "src/app/store/actions/photo.actions";
import { UserState } from "src/app/store/reducers/user.reducer";
import { selectLoginState } from "src/app/store/selectors/user.selectors";

@Component({
  selector: "app-photo-detail",
  templateUrl: "./photo-detail.component.html",
  styleUrls: ["./photo-detail.component.scss"],
})
export class PhotoDetailComponent implements OnInit {
  @ViewChild("myPhoto") myPhoto: ElementRef<HTMLImageElement>;
  readonly fileBaseUrl: string =
    (environment.production ? "" : "http://localhost") +
    environment.apiPath +
    "/File/";
  showSpinner = false;
  pageOfItems: Photo[];
  index: any;
  readonly pageSize: any;
  currentPage: any;
  readonly searchKey: any;
  readonly totalPages: any;
  paths: string[];
  mediaType: string;
  videoUrl: string;
  isPrivate: boolean;
  isEdit = false;
  tagsInOneLine: string;
  loginState$ = this._store.pipe(select(selectLoginState));

  constructor(
    private store: Store<fromPhoto.State>,
    private photoService: PhotoService,
    public dialogRef: MatDialogRef<PhotoDetailComponent>,
    private _store: Store<UserState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pageOfItems = data.pageOfItems;
    this.index = data.index;
    this.pageSize = data.pageSize;
    this.currentPage = data.currentPage;
    this.searchKey = data.searchKey;
    this.totalPages = data.totalPages;
    this.paths = data.paths;
  }
  ngOnInit(): void {
    this.SetUrl();
  }

  private SetUrl() {
    const photo = this.pageOfItems[this.index];
    this.isPrivate = photo.isPrivate;
    this.mediaType = photo.mediaType;
    this.tagsInOneLine = photo.tags.join();
    const searchRegExp = /\\/g;
    const url =
      this.fileBaseUrl +
      photo.path.replace(searchRegExp, "/") +
      "/" +
      photo.fileName;
    this.videoUrl = url;

    if (this.mediaType === "photo") {
      // https://blog.angular-university.io/angular-debugging/ for #myPhoto to get element
      setTimeout(() => {
        this.showSpinner = true;
        this.PreloadImage(url, () => {
          this.showSpinner = false;
        });
      });
    }
  }

  private PreloadImage(url, callback) {
    const img = this.myPhoto.nativeElement;
    img.src = url;
    if (img.complete) {
      callback();
      img.onload = () => {};
    } else {
      img.onload = () => {
        callback();
        //    clear onLoad, IE behaves irratically with animated gifs otherwise
        img.onload = () => {};
      };
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  plusSlides(direction: number): void {
    if (
      this.index + direction >= this.pageOfItems.length ||
      this.index + direction < 0
    ) {
      if (
        this.currentPage + direction <= 0 ||
        this.currentPage + direction > this.totalPages
      ) {
        // reach the edges, do nothing
        return;
      }
      this.switchPage(direction);
    } else {
      this.index += direction;
      this.SetUrl();
    }
  }

  switchPage(direction: number) {
    this.reloadPageOfItemsAsync(direction, true);
  }

  async markPrivateByIdAsync() {
    const photo = this.pageOfItems[this.index];
    const ret = await this.photoService
      .markPrivateById(photo.id)
      .toPromise()
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (ret !== null) {
      this.isPrivate = true;
      this.ReloadPhotosInfo();
    }
  }

  async markPublicByIdAsync() {
    const photo = this.pageOfItems[this.index];
    const ret = await this.photoService
      .markPublicById(photo.id)
      .toPromise()
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (ret !== null) {
      this.isPrivate = false;
      this.ReloadPhotosInfo();
    }
  }

  editTags() {
    this.isEdit = true;
  }

  cancelEditTags() {
    this.isEdit = false;
    this.tagsInOneLine = this.pageOfItems[this.index].tags.join();
  }

  async saveTagsAsync() {
    const photo = this.pageOfItems[this.index];
    const newTags = this.tagsInOneLine.toLowerCase().split(",");
    const ret = await this.photoService
      .updateTags(photo.id, newTags)
      .toPromise()
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (ret !== null) {
      this.isEdit = false;
      this.ReloadPhotosInfo();
    }
  }

  private async reloadPageOfItemsAsync(
    direction: number,
    changeIndex: boolean
  ) {
    const result = await this.photoService
      .getPhotos(
        this.searchKey,
        this.pageSize,
        (this.currentPage + direction - 1) * this.pageSize,
        this.paths
      )
      .toPromise()
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (result == null) return;
    if (result.value.length > 0) {
      this.pageOfItems = result.value;
      if (changeIndex) {
        this.index = direction === 1 ? 0 : result.value.length - 1;
      }
      this.currentPage = this.currentPage + direction;
      this.SetUrl();
    } else {
      // something wrong, data format is not expected, do nothing bug log.
      console.log(result);
    }
  }

  private ReloadPhotosInfo() {
    this.store.dispatch(
      loadPhotos({
        key: this.searchKey.toLowerCase(),
        pageSize: this.pageSize,
        skipPage: this.currentPage - 1,
        paths: this.paths,
      })
    );
  }
}
