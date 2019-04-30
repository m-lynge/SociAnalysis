import { Component, OnInit, Output, EventEmitter, AfterContentInit } from "@angular/core";
import { NewProjectService } from "src/app/new-project.service";
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-new-project-description',
  templateUrl: './new-project-description.component.html',
  styleUrls: ['./new-project-description.component.css']
})
export class NewProjectDescriptionComponent implements OnInit, AfterContentInit {

  @Output() show: EventEmitter<number> = new EventEmitter();

  constructor(public newprojectservice: NewProjectService, private router: Router, public navigationservice: NavigationService) { }

  ngOnInit() { }

  ngAfterContentInit(): void {
    //It's a new project 
    if (this.newprojectservice.NewProject) {
      this.navigationservice.GoBackRoute = ['/home'];
    } else {
      //It's an old project
      this.navigationservice.GoBackRoute = ['/projekt', ''];
    }
  }

  buttonClicked(): void {
    //It's a new project 
    if (this.newprojectservice.NewProject) {
      this.newprojectservice.Toggle = 1;
    } else {
      //It's an old project
      this.newprojectservice.saveProject();
      this.navigationservice.GoBackRoute = ['/home'];
      this.newprojectservice.ViewingNewProject = false;
      this.router.navigate(['/projekt', '']);
    }
  }
}
