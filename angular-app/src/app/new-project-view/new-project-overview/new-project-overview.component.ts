import { Component, OnInit, EventEmitter, Output, AfterContentInit } from "@angular/core";
import { NewProjectService } from "src/app/new-project.service";
import { FBServiceService } from 'src/app/fb-service.service';
import { Project } from '../../Project';
import { DirectoryService } from 'src/app/directory.service';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/navigation.service';




@Component({
  selector: 'app-new-project-overview',
  templateUrl: './new-project-overview.component.html',
  styleUrls: ['./new-project-overview.component.css']
})
export class NewProjectOverviewComponent implements OnInit, AfterContentInit {
  @Output() show: EventEmitter<number> = new EventEmitter();

  projectInfo: Project;
  constructor(
    public newprojectservice: NewProjectService,
    private fbservice: FBServiceService,
    private directoryservice: DirectoryService,
    private router: Router,
    private navigationservice: NavigationService) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    //It's a new project 
    if (this.newprojectservice.NewProject) {
      this.navigationservice.GoBackRoute = ['/projekt', ''];
    } else {
      //It's an old project
      // this.router.navigate(['/projekt', '']);
    }
  }
  showNext(): void {
    this.show.emit(0);
  }

  createProject() {
    const projectInfo = new Project(
      this.newprojectservice.name,
      this.newprojectservice.descr,
      this.newprojectservice.listOfSelectedGroups);
    this.navigationservice.GoBackRoute = ['/home'];
    this.newprojectservice.ViewingNewProject = false;
    this.directoryservice.createProjectDirectory(this.directoryservice.selectedUser, projectInfo);
    this.router.navigate(['/projekt', this.newprojectservice.name]);

  }
}
