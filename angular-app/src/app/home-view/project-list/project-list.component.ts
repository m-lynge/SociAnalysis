import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';
import { Project } from '../../Project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, AfterContentInit {
  projects: Project[];
  noProjects: boolean;

  constructor(private directoryservice: DirectoryService, private router: Router) {
    this.noProjects = true;
  }
  ngAfterContentInit(): void {
    // This line makes it run on test-data:
    this.directoryservice.selectedUser = '01';
    //
    this.directoryservice.getAllProjects(this.directoryservice.selectedUser).subscribe((element) => {
      console.log(element);

      this.projects = element;
      console.log(this.projects[0]);
      console.log(this.projects[0].hasOwnProperty('name'));

      if (!this.projects[0].hasOwnProperty('name')) {
        this.noProjects = true;
      } else {
        this.noProjects = false;
      }
      console.log('noProjects: ', this.noProjects);
    });
  }

  selectProject(projectName: string) {
    console.log('Selected project: ' + projectName);
    this.directoryservice.selectedProject = projectName;
    this.router.navigate(['/projekt']);
  }
  ngOnInit() {
  }
}
