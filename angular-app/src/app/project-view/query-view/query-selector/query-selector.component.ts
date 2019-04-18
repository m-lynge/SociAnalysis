import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';

@Component({
  selector: 'app-query-selector',
  templateUrl: './query-selector.component.html',
  styleUrls: ['./query-selector.component.css']
})
export class QuerySelectorComponent implements OnInit, AfterContentInit {

  retrievedQueryNames: string[];

  searchTerm: string;

  constructor(private directoryservice: DirectoryService) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    this.directoryservice.selectedUser = "01";
    this.directoryservice.selectedProject = "Created_project"
    this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
      .subscribe((queryArray) => {
        console.log("queries: ",queryArray);
        this.retrievedQueryNames = queryArray
      })

  }

  printSearchTerm(): void {
    console.log(this.searchTerm);
  }

  findMatchingQueries(): void {
    //called everytime the input field is changed
    console.log("CHANGED")
  }

}
