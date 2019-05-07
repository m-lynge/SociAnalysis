import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';
import { QueryService } from 'src/app/query.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  // ml19
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(private directoryservice: DirectoryService,
    private queryservice: QueryService) { }

  ngAfterContentInit(): void {
    this.subscription = this.queryservice.selectedQuerySubject.subscribe(() => {
      // ml19
      console.log('Query-selector: selectedQuerySubject');
      // this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
      // .subscribe((queryArray) => {
      //   this.shownQueryNames = queryArray;

      //   this.filteredOptions = this.myControl.valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => this._filter(value))
      //   );
      //   this.myControl.setValue(this.directoryservice.selectedQuery);
      // });
      this.shownQueryNames = this.queryservice.queryArray;

      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      this.myControl.setValue(this.directoryservice.selectedQuery);
    });
  }

  // findMatchingQueries(): void {
  //   // called everytime the input field is changed
  //   this.shownQueryNames = this.retrievedQueryNames.filter((query) => {
  //     return query.toLowerCase().includes(this.searchTerm.toLowerCase());
  //   });
  //   if (this.searchTerm === '') {
  //     this.shownQueryNames = this.retrievedQueryNames;
  //   }
  // }

  newQuerySelected(querySelected: any): void {
    this.directoryservice.selectedQuery = querySelected;
    this.queryservice.getSelectedQuery();
  }

  ngOnDestroy() {
     // ml19
     console.log('query-selector: unsubscribe');
    this.subscription.unsubscribe();
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.shownQueryNames.filter(option => option.toLowerCase().includes(filterValue));
  }
}
