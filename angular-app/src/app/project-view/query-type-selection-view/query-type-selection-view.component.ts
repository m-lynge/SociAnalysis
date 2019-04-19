import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-query-type-selection-view',
  templateUrl: './query-type-selection-view.component.html',
  styleUrls: ['./query-type-selection-view.component.css']
})
export class QueryTypeSelectionViewComponent implements OnInit {

  constructor() { }
  @Output()
  exportView: EventEmitter<string> = new EventEmitter();


  ngOnInit() {
  }

  changeView(input: string) {
    if (input === 'brugerdefineret') {
      this.exportView.emit('1');
    } else if (input === 'standard') {
      this.exportView.emit('2');

    }
  }

}
