/* https://github.com/cornflourblue/jw-angular-pagination */
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {paginate} from './jw-paginate';

@Component({
  selector: 'jw-pagination',
  templateUrl: './jw-pagination.component.html',
  styleUrls: ['./jw-pagination.component.scss']
}) 

export class JwPaginationComponent implements OnInit, OnChanges {
  @Input() totalItems: number;
  @Input() currentPage: number;
  @Output() changePage = new EventEmitter<any>(true);
  @Input() pageSize = 10;
  @Input() maxPages = 10;

  pager: any = {};

  ngOnInit() {
    // set page if items array isn't empty
    //if (this.totalItems > 0) {
    //  this.setPage(this.initialPage);
   // }
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset page if items array has changed
    if (changes.totalItems && changes.totalItems.currentValue !== changes.totalItems.previousValue 
      || changes.currentPage && changes.currentPage.currentValue !== changes.currentPage.previousValue 
      ) {
       // get new pager object for specified page
       this.pager = paginate(this.totalItems, this.currentPage, this.pageSize, this.maxPages); 
    }
  }

  private setPage(page: number) {  
    if (page<1 || page> this.pager.totalPages) return;
    // call change page function in parent component
    this.changePage.emit(
      {
        newPage: page,
        totalPages : this.pager.totalPages
      });
  }
}