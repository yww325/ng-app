import { Component, ViewChild, NgZone, OnInit} from '@angular/core'; 
import { PhotoListComponent } from '../photo-list/photo-list.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FolderFlatNode } from '../folder-tree/folder-database';
import { TokenService } from 'src/app/services/token.service';
import { PhotoService } from 'src/app/services/photo.service';
@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.scss']
})
export class MyPhotosComponent implements OnInit { 
  loggedIn = false;
  searchKey ='';
  paths : string[] = [];  
  @ViewChild(PhotoListComponent) photoList:PhotoListComponent;

  constructor(private tokenService : TokenService, private photoService: PhotoService) {}
  ngOnInit(): void {
    let token = this.tokenService.getToken();
    this.loggedIn =  token !== '' && token !== 'unauthorized';
  }
  
  onKeydown(event) {
    if (event.key === "Enter") { 
      this.photoList.currentPage = 1;
      this.photoList.search();
    }
  }

  onGoClick() {
    this.photoList.currentPage = 1; 
    this.photoList.search();
  } 

  selectionChanged(selection: SelectionModel<FolderFlatNode>) {
    let allPaths = selection.selected.map(f=>f.path).sort((a,b) => a.length -b.length);
    this.paths =[];
    allPaths.forEach(element => {
      if (this.paths.some(path=>element.startsWith(path))) {
         return;
      }
      this.paths.push(element);
    });  
  }

  
  markPrivate() : void {
    this.paths.forEach(p=>{
      this.photoService.markPrivate(p).subscribe(o=>{
        console.log(`all photos under ${o} makred private.`);
      },
        err=>{
          console.log(err.message);
        })
    })
  }

  markPublic() : void {
    this.paths.forEach(p=>{
      this.photoService.markPublic(p).subscribe(o=>{
        console.log(`all photos under ${o} makred public.`);
      },
        err=>{
          console.log(err.message);
        })
    })
  }

}
 