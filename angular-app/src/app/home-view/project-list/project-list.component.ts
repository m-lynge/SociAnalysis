import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/Group';
import { DirectoryService } from 'src/app/directory.service';
import { Project } from '../../Project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];

  constructor(private directoryservice: DirectoryService, private router: Router) {
    directoryservice.selectedUser = '01';
    directoryservice.getAllProjects(directoryservice.selectedUser).subscribe((element) => {
      this.projects = element;
    });
  }

  selectProject(projectName: string) {
    console.log('Selected project: ' + projectName);
    this.router.navigate(['/projekt']);
  }
  ngOnInit() {
  }

}
