import {AfterContentInit, Component, EventEmitter, NgZone, OnInit, Output} from "@angular/core";
import {MatChipInputEvent} from "@angular/material/chips";
import {Group} from "../../Group";
import {SearchTag} from 'src/app/project-view/query-setting-view/query-setting-view.component';
import {NewProjectService} from 'src/app/new-project.service';
import {FBServiceService} from "../../fb-service.service";

@Component({
    selector: "app-new-project-groups",
    templateUrl: "./new-project-groups.component.html",
    styleUrls: ["./new-project-groups.component.css"]
})
export class NewProjectGroupsComponent implements AfterContentInit, OnInit {
    @Output() show: EventEmitter<number> = new EventEmitter();

    searchTags: SearchTag[] = [];
    groupsAvailable: Group[];

    groupsSelected: Group[] = [];


    constructor(private newprojectservice: NewProjectService, private fbService: FBServiceService, private zone: NgZone) {
        this.groupsAvailable = [];
    }

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
            this.searchTags.push({tag: value.trim()});
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

    ngOnInit() {
        this.fbService.retrieveGroups();
    }


    ngAfterContentInit() {


    }

    showNext(): void {
        this.newprojectservice.ListOfGroups = this.groupsSelected;
        this.show.emit(2);
    }


}
