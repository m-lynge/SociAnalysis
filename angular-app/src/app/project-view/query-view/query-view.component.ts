import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DirectoryService } from "../../directory.service";
import { NavigationService } from 'src/app/navigation.service';
import { QueryService } from 'src/app/query.service';

@Component({
  selector: 'app-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.css']
})
export class QueryViewComponent implements AfterContentInit {

  constructor(private directoryservice: DirectoryService, private navigationservice: NavigationService,
              public queryservice: QueryService) { }

  ngAfterContentInit(): void {
    this.navigationservice.GoBackRoute = ['/home'];
  }
}



