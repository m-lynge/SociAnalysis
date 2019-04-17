import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: string[];

  constructor() {
    this.projects = ['project1', 'project2'];
  }

  selectProject(num: number) {
    console.log('Selected project: ' + num);
  }
  ngOnInit() {
  }

}
