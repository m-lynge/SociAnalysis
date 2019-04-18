import {
  Component,
  OnInit,
  NgModule,
  Output,
  EventEmitter
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { Group } from "../../Group";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-new-project-groups",
  templateUrl: "./new-project-groups.component.html",
  styleUrls: ["./new-project-groups.component.css"]
})
export class NewProjectGroupsComponent implements OnInit {
  @Output() show: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  showNext(): void {
    this.show.emit(2);
  }
}
