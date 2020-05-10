import { Component,  OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { FolderDatabase, FolderFlatNode, FolderNode } from './folder-database';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { Subscription } from 'rxjs'; 

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

  constructor(private database: FolderDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FolderFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);   
    this.checklistSelection.changed.subscribe(()=>{
        this.selectionChanged.emit(this.checklistSelection);
    })
  }
  ngOnInit(): void {
    this.sub = this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    }); 
    if (!this.dataSource.data || this.dataSource.data.length ==0) {
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

  checkAll(){
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if(!this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      this.treeControl.expand(this.treeControl.dataNodes[i])
    }
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: FolderFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    var allSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    if (allSelected &&  !this.checklistSelection.isSelected(node)) {
      return false;
     // this.checklistSelection.select(node);
    } else if (!allSelected && this.checklistSelection.isSelected(node)) {
      this.checklistSelection.deselect(node);
    }
    return allSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FolderFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FolderFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    if (descendants.length >0) {
        this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants); 
    } 
  } 
}
