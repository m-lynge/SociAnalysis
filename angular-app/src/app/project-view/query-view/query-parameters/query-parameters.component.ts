import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Query } from '../../../Query';
import { TestBed } from '@angular/core/testing';

import { Group } from 'src/app/Group';
import { DirectoryService } from 'src/app/directory.service';
import { QueryService } from 'src/app/query.service';

@Component({
  selector: 'app-query-parameters',
  templateUrl: './query-parameters.component.html',
  styleUrls: ['./query-parameters.component.css']
})

export class QueryParametersComponent implements OnInit, AfterContentInit, OnDestroy {
  QueryParams: Query = new Query('', [], { from: '', till: '' }, [], { max: 0, tags: [] }, []);
  amountOfPosts: number;
  dataReady: boolean;
  private subscription;


  constructor(private directoryservice: DirectoryService, private queryservice: QueryService) {

  }

  ngOnInit() {
    this.subscription = this.queryservice.selectedQuerySubject.subscribe((data) => {
      // ML18
      console.log('Query-parameters.subscribe getting: ', data);

      this.QueryParams = data;
      this.amountOfPosts = this.QueryParams.fbData.length;

    });
  }
  ngAfterContentInit(): void {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
