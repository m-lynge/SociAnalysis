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
  shownQueryNames: string[];
  private subscription;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(private directoryservice: DirectoryService,
              private queryservice: QueryService) { }

  ngAfterContentInit(): void {
    this.subscription = this.queryservice.selectedQuerySubject.subscribe(() => {
      this.shownQueryNames = this.queryservice.queryArray;

      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      this.myControl.setValue(this.directoryservice.selectedQuery);
    });
  }

  newQuerySelected(querySelected: any): void {
    this.directoryservice.selectedQuery = querySelected;
    this.queryservice.getSelectedQuery();
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.shownQueryNames.filter(option => option.toLowerCase().includes(filterValue));
  }
}
