import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';
import { QueryService } from 'src/app/query.service';

@Component({
  selector: 'app-query-selector',
  templateUrl: './query-selector.component.html',
  styleUrls: ['./query-selector.component.css']
})
export class QuerySelectorComponent implements AfterContentInit, OnDestroy {
  querytest;
  retrievedQueryNames: string[];
  shownQueryNames: string[];
  private subscription;
  searchTerm = '';

  constructor(private directoryservice: DirectoryService,
              private queryservice: QueryService) { }

  ngAfterContentInit(): void {
    this.subscription = this.queryservice.selectedQuerySubject.subscribe(() => {
      this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
      .subscribe((queryArray) => {
        this.retrievedQueryNames = queryArray;
        this.shownQueryNames = this.retrievedQueryNames;
        this.querytest = this.directoryservice.selectedQuery;
      });
    });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
