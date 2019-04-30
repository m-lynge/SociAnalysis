import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Query } from '../../../Query';
import { TestBed } from '@angular/core/testing';

import { Group } from 'src/app/Group';
import { DirectoryService } from 'src/app/directory.service';

@Component({
  selector: 'app-query-parameters',
  templateUrl: './query-parameters.component.html',
  styleUrls: ['./query-parameters.component.css']
})

export class QueryParametersComponent implements OnInit, AfterContentInit {
  QueryParams: Query = new Query('',[],{from: '', till: ''}, [],{max: 0, tags:[]}, []);
  dataReady: boolean;



  constructor(private directoryservice: DirectoryService) {
    this.dataReady = true;

  }

  ngOnInit() {

  }
  ngAfterContentInit(): void {
    this.directoryservice.getQuery(
      this.directoryservice.selectedUser,
      this.directoryservice.selectedProject,
      this.directoryservice.selectedQuery).then((data => {
        this.QueryParams.name = data.name;
        this.QueryParams.timeperiod = data.timeperiod;
        this.QueryParams.filter = data.filter;
        this.QueryParams.groups = data.groups;
        this.QueryParams.fbData = data.fbData;
        this.dataReady = true;
      } ));
  }


}
