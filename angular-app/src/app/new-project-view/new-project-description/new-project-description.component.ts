import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NewProjectService } from "src/app/new-project.service";

@Component({
  selector: 'app-new-project-description',
  templateUrl: './new-project-description.component.html',
  styleUrls: ['./new-project-description.component.css']
})
export class NewProjectDescriptionComponent implements OnInit {
  // Variables used to store the input
  private title: string = "";
  private description: string = "";

  @Output() show: EventEmitter<number> = new EventEmitter();

  constructor(public newprojectservice: NewProjectService) {}

  ngOnInit() {}

  showNext(): void {
    console.log('call shownext');
    this.newprojectservice.Toggle = 1;
  }
}
