import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalSize;
  @Input() data;
  @Output('filteredData') filteredData: EventEmitter<any[]> = new EventEmitter();
  private pages: number[] = [];
  pageMinIndex: number;
  pageMaxIndex: number;
  selectedIndex: number = 0;
  selectedPage: number = 1;

  constructor() { }

  ngOnInit() {
    console.log("Size: ", this.totalSize);
    this.calculatePages();
  }

  ngOnChanges(changes) {
    console.log(changes);
    let change: SimpleChange = (<SimpleChange>changes);
    if ("totalSize" in changes) {
      if (!change["totalSize"].isFirstChange()) {
        this.totalSize = change["totalSize"].currentValue;
        this.calculatePages();
      }
    }
    if ("data" in changes) {
      if (!change["data"].isFirstChange()) {
        this.data = change["data"].currentValue;
        this.calculatePages();
      }
    }
  }

  calculatePages() {
    this.pages = [];
    let pageCount = Math.ceil(this.data.length / this.totalSize);
    for (let i = 1; i <= pageCount; i++) {
      this.pages.push(i);
    }
    this.pageMinIndex = 0;
    this.pageMaxIndex = 5;
    this.selectedIndex = 0;
    this.selectedPage = 1;
    this.sliceResults(this.selectedPage);
  }

  sliceResults(index: number) {
    // Emit returned data 
    let selectedNumber = index;
    this.selectedPage = index;
    this.filteredData.emit(this.data.slice((selectedNumber - 1) * this.totalSize, selectedNumber * this.totalSize));
  }

  nextPage() {
    if (this.pageMaxIndex + 1 <= this.pages.length) {
      this.pageMinIndex++;
      this.pageMaxIndex++;
      console.log(this.pageMaxIndex);
    }
  }
  previousPage() {
    if (this.pageMinIndex - 1 >= 0) {
      this.pageMinIndex--;
      this.pageMaxIndex--;
    }
  }
  firstPage() {
    this.sliceResults(this.pages[0]);
  }
  lastPage() {
    this.sliceResults(this.pages[this.pages.length - 1]);
  }

}
