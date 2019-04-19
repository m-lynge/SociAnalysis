import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NewProjectService } from "src/app/new-project.service";

@Component({
  selector: "app-new-project-overview",
  templateUrl: "./new-project-overview.component.html",
  styleUrls: ["./new-project-overview.component.css"]
})
export class NewProjectOverviewComponent implements OnInit {
  @Output() show: EventEmitter<number> = new EventEmitter();

  constructor(public newprojectservice: NewProjectService) {}

  ngOnInit() {}
  showNext(): void {
    this.show.emit(0);
  }
}
