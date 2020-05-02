import { Component, ViewChild, NgZone} from '@angular/core'; 
import { PhotoListComponent } from '../photo-list/photo-list.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FolderFlatNode } from '../folder-tree/folder-database';
@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.scss']
})
export class MyPhotosComponent  { 
  searchKey ='';
  paths : string[] = [];  
  @ViewChild(PhotoListComponent) photoList:PhotoListComponent;

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
}
 