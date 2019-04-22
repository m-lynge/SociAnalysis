import {
  Component,
  OnInit,
  NgModule,
  Output,
  EventEmitter,
  AfterContentInit
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { Group } from "../../Group";
import { FormControl } from "@angular/forms";
import { SearchTag } from 'src/app/project-view/query-setting-view/query-setting-view.component';
import { NewProjectService } from 'src/app/new-project.service';

@Component({
  selector: "app-new-project-groups",
  templateUrl: "./new-project-groups.component.html",
  styleUrls: ["./new-project-groups.component.css"]
})
export class NewProjectGroupsComponent implements AfterContentInit {
  @Output() show: EventEmitter<number> = new EventEmitter();

  searchTags: SearchTag[] = [];
  groupsAvailable: Group[] = [
        new Group('group1', 'Desc1'),
        new Group('group2', 'Desc2'),
        new Group('group3', 'Desc3'),
        new Group('group4', 'Desc4'),
  ];

  groupsSelected: Group[] = [];


  constructor(private newprojectservice: NewProjectService) {}

  addToSelected(i: number) {
    this.groupsSelected.push(this.groupsAvailable[i]);
    this.groupsAvailable.splice(i, 1);
  }

  addToAvailable(i: number) {
    this.groupsAvailable.push(this.groupsSelected[i]);
    this.groupsSelected.splice(i, 1);
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

     // Add our fruit
     if ((value || '').trim()) {
      this.searchTags.push({ tag: value.trim() });
  }

  // Reset the input value
  if (input) {
      input.value = '';
  }

}

remove(tag: SearchTag): void {
  const index = this.searchTags.indexOf(tag);

  if (index >= 0) {
      this.searchTags.splice(index, 1);
  }
}


  ngAfterContentInit(): void {


  }

  showNext(): void {
    this.newprojectservice.ListOfGroups = this.groupsSelected;
    this.show.emit(2);
  }



}
