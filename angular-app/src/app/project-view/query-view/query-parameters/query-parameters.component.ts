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
  group1 = new Group('venligboerne Sjælland', 'blabla');
  group2 = new Group('venligboerne Jylland', 'blabla');
  QueryParams: Query;
  constructor() {
    this.QueryParams = {
      name: 'Søgning venliboerne',
      params: ['messages', 'likes'],
      timeperiod: { from: '10/10-2018', till: '01/04-2019' },
      groups: [this.group1, this.group2],
      filter: { max: 50, tags: ['heine', 'hvad', 'nej' , 'rasmus', 'muslim'] },
      fbData: [{ name: 'post1', data: [] },{ name: 'post1', data: [] },{ name: 'post1', data: [] },{ name: 'post1', data: [] }]
    }
  }

  ngOnInit() {
  }


}
