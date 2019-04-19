import { Component, AfterContentInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Group } from '../../Group';
import { FormControl } from '@angular/forms';
import { DirectoryService } from 'src/app/directory.service';
import { FBServiceService } from 'src/app/fb-service.service';

import { Project } from '../../Project';

export interface QuerySettingsInterface {
    name: string;
    params: string[];
    timeperiod: { from: string; till: string };
    groups: string[];
    filter: { max: number; tags: string[] };
}

export interface SearchTag {
    tag: string;
}

@Component({
    selector: 'app-query-setting-view',
    templateUrl: './query-setting-view.component.html',
    styleUrls: ['./query-setting-view.component.css']
})



export class QuerySettingViewComponent implements AfterContentInit {
    queryName: string;


    postsCheck = new FormControl(false);
    commentsCheck = new FormControl(false);
    likesCheck = new FormControl(false);
    reactionsCheck = new FormControl(false);
    picturesCheck = new FormControl(false);
    linksCheck = new FormControl(false);
    beginDate = new FormControl(false);
    endDate = new FormControl(false);





    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

    searchTags: SearchTag[] = [];
    groupsAvailable: Group[] = [
        new Group('group1', 'Desc1'),
        new Group('group2', 'Desc2'),
        new Group('group3', 'Desc3'),
        new Group('group4', 'Desc4'),
    ];

    groupsSelected: Group[] = [];


    constructor(private directoryservice: DirectoryService, private fbservice: FBServiceService) {

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

    StartQuery() {

        console.log('search tags: ', this.searchTags);

        let allParams: any = [
            { name: 'postsCheck', clicked: this.postsCheck.value },
            { name: 'commentsCheck', clicked: this.commentsCheck.value },
            { name: 'likesCheck', clicked: this.likesCheck.value },
            { name: 'reactionCheck', clicked: this.reactionsCheck.value },
            { name: 'picturesCheck', clicked: this.picturesCheck.value },
            { name: 'linksCheck', clicked: this.linksCheck.value }
        ];

        const chosenParams = allParams.filter((param: any) => {
            if (param.clicked === true) {
                return param;
            }
        }).map((param: any) => {
            return param.name;
        });

        console.log("chosen beginddate:", this.beginDate);
        // This does not work yet
        console.log("chosen beginddate:", JSON.stringify(this.beginDate.value.toJSON()));

        //to fb service
        let exportQuery = {
            name: this.queryName,
            params: chosenParams,
            timeperiod: { from: '', till: '' },
            groups: [''],
            filter: { max: 0, tags: [''] }
        };
    }
    ngAfterContentInit(): void {
        // Lines for test perpose
        this.directoryservice.selectedUser = '01';
        this.directoryservice.selectedProject = 'Created_project';
        this.directoryservice.getProject(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((projects: string) => {
                const tempProject: Project = JSON.parse(projects);
                console.log(tempProject);
                this.groupsAvailable = tempProject.group;
                console.log('groups:', this.groupsAvailable);

            });
    }

}
