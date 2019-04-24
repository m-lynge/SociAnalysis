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
import { DirectoryService } from 'src/app/directory.service';
import { group } from '@angular/animations';
import { query } from '@angular/core/src/render3';



@Component({
    selector: "app-new-project-groups",
    templateUrl: "./new-project-groups.component.html",
    styleUrls: ["./new-project-groups.component.css"]
})
export class NewProjectGroupsComponent implements AfterContentInit, OnInit {
    @Output() show: EventEmitter<number> = new EventEmitter();

  retrievedQueryNames: string[];
  showQueryNames: string[];

  searchTerm = '';

  searchTags: SearchTag[] = [];
  groupsAvailable: Group[] = [
    new Group('group1', 'Desc1'),
    new Group('Test2', 'Test2'),
    new Group('Fun3', 'Fun3'),
    new Group('DiscoHeine4', 'DiscoHeine4'),
  ];
  groupsShown: Group[];

    groupsSelected: Group[] = [];

  constructor(private newprojectservice: NewProjectService, private directoryservice: DirectoryService) { }


  addToSelected(i: number) {
    this.groupsSelected.push(this.groupsShown[i]);
    this.groupsShown.splice(i, 1);
  }

  addToAvailable(i: number) {
    this.groupsShown.push(this.groupsSelected[i]);
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

        if (index >= 0) {
            this.searchTags.splice(index, 1);
        }
    }

    ngOnInit() {
        this.groupsAvailable = this.fbService.retrieveGroups();
    }

  ngAfterContentInit(): void {

    this.directoryservice.selectedUser = "01";
    this.groupsShown = this.groupsAvailable;
  }


  findMatchingGroups(): void {
    console.log('pls dont hate me Nicklas')
    this.groupsShown = this.groupsAvailable.filter((group: Group) => {
      
      return group.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());

    });
  }

  showNext(): void {
    this.newprojectservice.ListOfGroups = this.groupsSelected;
    this.show.emit(2);
  }

    }



}
