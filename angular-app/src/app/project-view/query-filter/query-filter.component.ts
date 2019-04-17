import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DirectoriesService } from 'src/app/directories.service';

@Component({
  selector: 'app-query-filter',
  templateUrl: './query-filter.component.html',
  styleUrls: ['./query-filter.component.css']
})
export class QueryFilterComponent implements OnInit, AfterContentInit {


  constructor(private retrievedQueries: string[], private directoryService: DirectoriesService) {

  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    this.retrievedQueries = this.directoryService.getQueries();
  }

}
