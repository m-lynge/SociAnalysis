import { Component, OnInit } from '@angular/core';
import {Query} from '../../../Query';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-query-parameters',
  templateUrl: './query-parameters.component.html',
  styleUrls: ['./query-parameters.component.css']
})
export class QueryParametersComponent implements OnInit {
  QueryParams: Query;
  constructor() {
    this.QueryParams = {
      name: 'Test',
      params: [],
      timeperiod: {from:'10', till:'10'},
      groups: [],
      filter: {max: 50, tags: ['Hello', 'father']}
      
    }
   }

  ngOnInit() {
  }

}
