import { Component, OnInit } from '@angular/core';
import {DirectoryService} from "../../directory.service";

@Component({
  selector: 'app-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.css']
})
export class QueryViewComponent implements OnInit {

  constructor(private directoryservice: DirectoryService) { }

  ngOnInit() {
    // this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
    //     .subscribe((queryArray) => {
    //       console.log('queries: ', queryArray);
    //       if (queryArray[0]){
    //         this.directoryservice.selectedQuery = queryArray[0];
    //       } else {
    //         console.log("No query Array!");
    //       }
    //
    //     });
  }

}
