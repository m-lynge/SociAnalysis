import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';
import { QueryService } from 'src/app/query.service';

@Component({
  selector: 'app-query-selector',
  templateUrl: './query-selector.component.html',
  styleUrls: ['./query-selector.component.css']
})
export class QuerySelectorComponent implements OnInit, AfterContentInit {
  querytest;
  retrievedQueryNames: string[];
  shownQueryNames: string[];

  searchTerm = '';

  constructor(private directoryservice: DirectoryService,
              private queryservice: QueryService) { }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
      .subscribe((queryArray) => {
        this.retrievedQueryNames = queryArray;
        this.shownQueryNames = this.retrievedQueryNames;
        // console.log('From selector: ', this.directoryservice.selectedQuery);
        this.querytest = this.directoryservice.selectedQuery;
      });
  }

  printSearchTerm(): void {
  }

  findMatchingQueries(): void {
    // called everytime the input field is changed
    this.shownQueryNames = this.retrievedQueryNames.filter((query) => {
      return query.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
    if (this.searchTerm === '') {
      this.shownQueryNames = this.retrievedQueryNames;
    }
  }

  newQuerySelected(querySelected: any): void {
    this.directoryservice.selectedQuery = querySelected;
    this.queryservice.getSelectedQuery();
  }

}
