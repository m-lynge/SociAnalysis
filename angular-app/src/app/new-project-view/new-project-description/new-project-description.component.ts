import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NewProjectService } from "src/app/new-project.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project-description',
  templateUrl: './new-project-description.component.html',
  styleUrls: ['./new-project-description.component.css']
})
export class NewProjectDescriptionComponent implements OnInit {

  @Output() show: EventEmitter<number> = new EventEmitter();

  constructor(public newprojectservice: NewProjectService, private router: Router) {}

  ngOnInit() {}

  buttonClicked(): void {
    if (this.newprojectservice.NewProject) {
      this.newprojectservice.Toggle = 1;
    } else {
      this.newprojectservice.saveProject();
      this.router.navigate(['/projekt']);
    }
  }
}
