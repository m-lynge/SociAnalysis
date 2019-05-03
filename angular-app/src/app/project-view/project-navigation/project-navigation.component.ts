import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';
import { NewProjectService } from '../../new-project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.css']
})
export class ProjectNavigationComponent implements OnInit, AfterViewChecked {
  projectName: string;
  constructor(
    public directoryservice: DirectoryService,
    private newprojectservice: NewProjectService,
    private router: Router) { }


  ngOnInit() {
    //this.projectName = this.directoryservice.selectedProject;
    // TODO - IMPLEMENT THIS USE LATER 
    // this.callUpdate();
  }

  callUpdate() {
    // this.projectName = this.directoryservice.selectedProject;
  }

  ngAfterViewChecked(): void {
    // this.projectName = this.directoryservice.selectedProject;
  }

  editProject(toggle: number) {
    this.newprojectservice.ViewingNewProject = true;
    this.newprojectservice.loadExistingProject(toggle);
    this.router.navigate(['/opretprojekt']);

  }
  showGroup() {

  }
  showOverview() {

  }
}
