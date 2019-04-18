import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-query-menu',
  templateUrl: './query-menu.component.html',
  styleUrls: ['./query-menu.component.css']
})
export class QueryMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }


  newQuery() {
    console.log('new query clicked');
  }

  updateQuery() {
    console.log('update query clicked');
  }

  exportQuery() {
    console.log('export query clicked');
  }
}
