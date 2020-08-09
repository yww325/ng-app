import { Component,  OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { FolderDatabase, FolderFlatNode, FolderNode } from './folder-database';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CreateNewFolderDialogComponent } from './create-new-folder-dialog.component';
import { FolderService } from 'src/app/services/folder.service';
import { TokenService } from 'src/app/services/token.service';
import { GeneralDialogComponent } from '../shared/general-dialog.component';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
  providers: [FolderDatabase]
})
export class FolderTreeComponent implements OnDestroy, OnInit {


  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FolderFlatNode, FolderNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<FolderNode, FolderFlatNode>();

  treeControl: FlatTreeControl<FolderFlatNode>;

  treeFlattener: MatTreeFlattener<FolderNode, FolderFlatNode>;

  dataSource: MatTreeFlatDataSource<FolderNode, FolderFlatNode>;

  sub: Subscription;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FolderFlatNode>(true /* multiple */);
  //  https://indepth.dev/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error/
  @Output() selectionChanged = new EventEmitter<SelectionModel<FolderFlatNode>>(true);
  loggedIn: boolean;

  constructor(private database: FolderDatabase,
              private dialog: MatDialog,
              private folderService: FolderService,
              private tokenService: TokenService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FolderFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.checklistSelection.changed.subscribe(() => {
        this.selectionChanged.emit(this.checklistSelection);
    });
  }
  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.loggedIn =  token !== '' && token !== 'unauthorized';
    this.sub = this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    if (!this.dataSource.data || this.dataSource.data.length == 0) {
      this.database.load();
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.database.destroy();
  }

  getLevel = (node: FolderFlatNode) => node.level;

  isExpandable = (node: FolderFlatNode) => node.expandable;

  getChildren = (node: FolderNode): FolderNode[] => node.children;

  hasChild = (_: number, _nodeData: FolderFlatNode) => _nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: FolderNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    if (existingNode && existingNode.path === node.path) {
      return existingNode;
    }
    const flatNode =  new FolderFlatNode();
    flatNode.path = node.path;
    flatNode.name = node.name;
    flatNode.id = node.id;
    flatNode.level = level;
    flatNode.expandable = node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  checkAll() {
      for (const node of this.treeControl.dataNodes) {
          if (!this.checklistSelection.isSelected(node)) {
                this.checklistSelection.select(node);
            }
      }
  }


  clearAll() {
    this.checklistSelection.clear();
  }

  createFolder() {
    if (this.checklistSelection.selected.length <= 1) {
        const selected = this.checklistSelection.selected.length === 1
            ? this.checklistSelection.selected[0]
            : { path: 'Root', id : '000000000000000000000000'};
        const dialogRef = this.dialog.open(CreateNewFolderDialogComponent, {
          width: '450px',
          data: {parentPath: selected.path, folderName: ''}
        });

        dialogRef.afterClosed().subscribe(folderName => {
          if (folderName !== undefined) {
             this.folderService.createNewFolder(selected.id, folderName).subscribe(result => {
                this.dialog.open(GeneralDialogComponent, {
                  width: '450px',
                  data: { title: 'folder creation result', message: result }
                });
                this.database.load();
                this.checklistSelection.clear();
             });
          }
        });
    } else {
      this.dialog.open(GeneralDialogComponent, {
        width: '450px',
        data: { title: 'error', message: 'You need to select 1 folder as parent for your new folder.' }
      });
    }
  }

  /** Toggle the to-do item selection. don't Select/deselect all the descendants node anymore */
  todoItemSelectionToggle(node: FolderFlatNode) {
      this.checklistSelection.toggle(node);
  }
}
