import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs'; 
import { Folder } from 'src/app/models/folder';
import { Store, select } from '@ngrx/store';
import * as fromFolder from '../../store/reducers/folder.reducer';
import { selectFolders } from '../../store/selectors/folder.selectors';
import { loadFolders } from '../../store/actions/folder.actions';
/**
 * Node for to-do item
 */
export class FolderNode {
    children: FolderNode[];
    path: string;
    name: string; 
    id: string;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class FolderFlatNode {
    path: string;
    name: string; 
    id: string;
    level: number;
    expandable: boolean;
  } 

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class FolderDatabase {
  dataChange = new BehaviorSubject<FolderNode[]>([]);
  get data(): FolderNode[] { return this.dataChange.value; }
  sub :Subscription;
  constructor(private _store: Store<fromFolder.State>) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children. 
    this.sub = this._store.pipe(select(selectFolders)).subscribe(folders=>{
      const data = this.buildFileTree(folders); 
      // Notify the change.
      this.dataChange.next(data);
    });  
  }

  load() {
    this._store.dispatch(loadFolders());
  }
  destroy() {
    this.sub.unsubscribe();
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(folders: Folder[]): FolderNode[] {  
    let rootNodes = [];
    let allNodes = folders.map(element => {
      const node = new FolderNode();
      node.id = element.id;
      node.name = element.name;
      node.path = element.path; 
      node.children = [];
      return node;
    });

    for (let index = 0; index < allNodes.length; index++) {
      const node = allNodes[index];
      const folder = folders[index];
      folders.forEach((element, childIndex) => {
          if (element.parentFolderId === folder.id) {
            node.children.push(allNodes[childIndex]);
          }
      });
      if (folder.parentFolderId === "000000000000000000000000")
      {
        rootNodes.push(node);
      }
    }
     
    return rootNodes;
  }

  /** Add an item to to-do list */
  insertItem(parent: FolderNode, name: string) {
    if (parent.children) {
      parent.children.push({path: name} as FolderNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: FolderNode, name: string) {
    node.path = name;
    this.dataChange.next(this.data);
  }
}
