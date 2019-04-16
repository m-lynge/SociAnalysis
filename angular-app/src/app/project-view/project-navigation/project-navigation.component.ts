import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '../../directories.service';
import { Selected } from '../../Selected'

@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.css']
})
export class ProjectNavigationComponent implements OnInit {
  constructor(private directoryService: DirectoriesService) { }
  private projectName: string;

  ngOnInit() {
    this.projectName = 'PLACEHOLDERNAME';
    // TODO - IMPLEMENT THIS USE LATER 
    // this.callUpdate();
  }

  callUpdate(){
    console.log('BUTTON CLICKED');
    console.log('USER CHOSEN: ', this.directoryService.getSelected().user);
    this.projectName = this.directoryService.getSelected().project;
  }
}
