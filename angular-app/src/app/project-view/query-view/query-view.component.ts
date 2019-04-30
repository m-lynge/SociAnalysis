import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DirectoryService } from "../../directory.service";
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.css']
})
export class QueryViewComponent implements OnInit, AfterContentInit {

  constructor(private directoryservice: DirectoryService, private navigationservice: NavigationService) { }

  ngOnInit() {
    // this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
    //     .subscribe((queryArray) => {
    //       if (queryArray[0]){
    //         this.directoryservice.selectedQuery = queryArray[0];
    //       } else {
    //       }
    //
    //     });
  }

  ngAfterContentInit(): void {
    console.log("routing back to home");
    this.navigationservice.GoBackRoute = ['/home'];
  }
}



