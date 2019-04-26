import { AfterContentInit, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { Group } from "../../Group";
import { SearchTag } from 'src/app/project-view/query-setting-view/query-setting-view.component';
import { NewProjectService } from 'src/app/new-project.service';
import { DirectoryService } from 'src/app/directory.service';
import { Router } from '@angular/router';


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
    groupsAvailable: Group[] = [];
    groupsShown: Group[];

    groupsSelected: Group[] = [];

    constructor(
        public newprojectservice: NewProjectService,
        private directoryservice: DirectoryService,
        private router: Router) { }

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


    ngOnInit() {
    }

    ngAfterContentInit(): void {
        // If it is a new project
        if (this.newprojectservice.NewProject) {
            if (this.newprojectservice.ListOfGroups) {
                this.groupsShown = this.newprojectservice.ListOfGroups;
            } else {
                // in case there are no groups
            }
        // if it is to load an existing project
        } else {
                // Load lists for existing projects
        }
    }


    findMatchingGroups(): void {
        this.groupsShown = this.groupsAvailable.filter((group: Group) => {
            return group.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        });
    }

    showNext(): void {
        if (this.newprojectservice.NewProject) {
            this.newprojectservice.ListOfGroups = this.groupsSelected;
            this.newprojectservice.Toggle = 2;
        } else {
            this.newprojectservice.saveProject();
            this.router.navigate(['/projekt']);
        }
    }

}
