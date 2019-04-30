import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';
import { Project } from '../../Project';
import { Router } from '@angular/router';
import { NewProjectService } from 'src/app/new-project.service';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  projects: Project[];
  noProjects: boolean;

  constructor(
    private directoryservice: DirectoryService,
    private router: Router,
    private newprojectservice: NewProjectService
  ) {
    this.noProjects = true;
  }
  ngAfterViewInit(): void {
    // This line makes it run on test-data:
    // this.directoryservice.selectedUser = '01';
    //
    this.getProjects();
  }

  selectProject(projectName: string) {
    this.directoryservice.selectedProject = projectName;
    this.router.navigate(['/projekt', '']);
  }
  ngOnInit() {
  }

  public deleteProject(projectName: string) {
    if (confirm('Dette vil slette projektet: ' + projectName + ' - og dets indhold')) {
      this.directoryservice.removeProject(this.directoryservice.selectedUser, projectName).then(() => {
        this.directoryservice.getAllProjects(this.directoryservice.selectedUser).subscribe((element) => {
          this.projects = element;
          if (this.projects && this.projects[0]) {
            if (!this.projects[0].hasOwnProperty('name')) {
              this.noProjects = true;
            } else {
              this.noProjects = false;
            }
          }
        });
      });
    }
  }

  getProjects() {
    this.directoryservice.getAllProjects(this.directoryservice.selectedUser).subscribe((element) => {
      this.projects = element;
      if (this.projects && this.projects[0]) {
        if (!this.projects[0].hasOwnProperty('name')) {
          this.noProjects = true;
        } else {
          this.noProjects = false;
        }
      }
    });
  }
}
