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
  private name: string;
  private params: string[];
  private timeperiod: any;
  private groups: Group[];
  private filter: any;
  QueryParams: Query;
  constructor() {
    this.QueryParams = {
      name: 'Test',
      params: ['messages', 'likes'],
      timeperiod: { from: '10/10-2018', till: '01/04-2019' },
      groups: [],
      filter: { max: 50, tags: ['Hello', 'father'] },
      fbData: [{ name: 'post1', data: [] }]
    }
  }

  ngOnInit() {
  }


}
