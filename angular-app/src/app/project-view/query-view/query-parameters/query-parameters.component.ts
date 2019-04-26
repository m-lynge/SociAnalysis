import { Component, OnInit } from '@angular/core';
import { Query } from '../../../Query';
import { TestBed } from '@angular/core/testing';

import { Group } from 'src/app/Group';

@Component({
  selector: 'app-query-parameters',
  templateUrl: './query-parameters.component.html',
  styleUrls: ['./query-parameters.component.css']
})

export class QueryParametersComponent implements OnInit {
  QueryParams: Query;
  constructor() {
  }

  ngOnInit() {
  }


}
