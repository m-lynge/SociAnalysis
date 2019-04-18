import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';

@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.css']
})
export class ProjectNavigationComponent implements OnInit, AfterViewChecked {
  projectName: string;
  constructor(private directoryservice: DirectoryService) { }


  ngOnInit() {
    this.projectName = 'PLACEHOLDERNAME';
    // TODO - IMPLEMENT THIS USE LATER 
    // this.callUpdate();
  }

  callUpdate() {
    console.log('BUTTON CLICKED');
    console.log('USER CHOSEN: ', this.directoryservice.selectedUser);
    this.projectName = this.directoryservice.selectedProject;
  }

  ngAfterViewChecked(): void {
    this.projectName = this.directoryservice.selectedProject;
  }
}
