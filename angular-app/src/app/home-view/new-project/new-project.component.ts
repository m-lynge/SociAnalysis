import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewProjectService } from 'src/app/new-project.service';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  constructor(private router: Router, private newprojectservice: NewProjectService, private navigationservice: NavigationService) { }

  createNewProject() {
    this.newprojectservice.loadNewProject();
    this.navigationservice.backButtonIsActive = true;
    this.router.navigate(['opretprojekt']);
  }
  ngOnInit() {
  }

}
