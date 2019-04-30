import {AfterContentInit, Component, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {Group} from '../../Group';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DirectoryService} from 'src/app/directory.service';
import {FBServiceService} from 'src/app/fb-service.service';

import {Project} from '../../Project';
import {NewQuery} from 'src/app/NewQuery';

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


export class QuerySettingViewComponent implements AfterContentInit, OnInit {

    myForm: FormGroup;


    queryName: string;

    showLoading: boolean;

    postsCheck = new FormControl(false);
    commentsCheck = new FormControl(false);
    likesCheck = new FormControl(false);
    reactionsCheck = new FormControl(false);
    picturesCheck = new FormControl(false);
    linksCheck = new FormControl(false);
    beginDate = new FormControl(false);
    endDate = new FormControl(false);

    useDateControl = new FormControl(false);

    maxInput = new FormControl();


    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

    searchTags: SearchTag[] = [];
    groupsAvailable: Group[] = [];

    groupsSelected: Group[] = [];


    constructor(private directoryservice: DirectoryService, private fbservice: FBServiceService, private formBuilder: FormBuilder) {

    }

    ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚÆØÅæøå ]+$')
            ]],
            useDate: [false, []]
        });

        this.myForm.valueChanges.subscribe(console.log);
    }

    get name() {
        return this.myForm.get('name');
    }

    get useDate() {
        return this.myForm.get('useDate');
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

        if ((value || '').trim()) {
            this.searchTags.push({tag: value.trim()});
        }

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

        this.showLoading = true;


        const allParams: any = [
            {name: 'message', clicked: this.postsCheck.value},
            {name: 'comments', clicked: this.commentsCheck.value},
            {name: 'likes', clicked: this.likesCheck.value},
            {name: 'reactions', clicked: this.reactionsCheck.value},
            {name: 'picture', clicked: this.picturesCheck.value},
            {name: 'link', clicked: this.linksCheck.value}
        ];

        const chosenParams = allParams.filter((param: any) => {
            if (param.clicked === true) {
                return param;
            }
        }).map((param: any) => {
            return param.name;
        });

        const chosenTags = this.searchTags.map((tag) => {
            return tag.tag;
        });

        let beginDate;
        let endDate;

        if (this.useDate) {
            if (this.beginDate.value !== false && this.endDate.value !== false) {
                beginDate = this.beginDate.value.toLocaleDateString();
                endDate = this.endDate.value.toLocaleDateString();
            }
        } else {
            beginDate = '0';
            endDate = '0';
        }


        // to fb service
        const exportQuery: NewQuery = {
            name: this.queryName,
            params: chosenParams,
            timeperiod: {
                from: beginDate,
                till: endDate
            },
            groups: this.groupsSelected,
            filter: {max: this.maxInput.value, tags: chosenTags}
        };
        // ---- THIS DOES NOT WORK ---->>>>>>> ERROR CODE: 98607452dh34562xs -- Code does not compile --
        this.fbservice.DoSearchForPosts(exportQuery);
    }

    ngAfterContentInit(): void {

        this.directoryservice.getProject(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((projects: string) => {
                const tempProject: Project = JSON.parse(projects);
                this.groupsAvailable = tempProject.group;


            });
    }

}
