import {AfterContentInit, Component, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {Group} from '../../Group';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DirectoryService} from 'src/app/directory.service';
import {FBServiceService} from 'src/app/fb-service.service';
import {Query} from "../../Query";
import {Project} from '../../Project';
import {NewQuery} from 'src/app/NewQuery';
import {Router} from "@angular/router";

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
    queryName: string;
    isValid = false;
    showLoading: boolean;

    myForm: FormGroup;
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

    constructor(
        private directoryservice: DirectoryService,
        private fbservice: FBServiceService,
        private formBuilder: FormBuilder,
        private router: Router) {
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚÆØÅæøå ]+$')
            ]],
            useDate: [false, []],
            max: ['', [
                Validators.pattern('asd')
            ]],
        });

        this.myForm.valueChanges.subscribe(console.log);
    }

    get name() {
        return this.myForm.get('name');
    }

    get max() {
        return this.myForm.get('max');
    }

    get useDate() {
        return this.myForm.get('useDate');
    }

    get hasGroup() {
        return this.myForm.get('hasGroup');
    }


    addToSelected(i: number) {
        this.groupsSelected.push(this.groupsAvailable[i]);
        this.groupsAvailable.splice(i, 1);
        this.isValid = true;
    }

    addToAvailable(i: number) {
        this.groupsAvailable.push(this.groupsSelected[i]);
        this.groupsSelected.splice(i, 1);
        if (this.groupsSelected.length <= 0) {
            this.isValid = false;
        }
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        let alreadyExist = false;
        if (this.searchTags) {
            this.searchTags.forEach((previousTag) => {
                if (previousTag.tag.toLowerCase() === value.trim().toLowerCase()) {
                    alreadyExist = true;
                }
            });
        }

        if (alreadyExist === false) {
            if ((value || '').trim()) {
                this.searchTags.push({tag: value.trim()});
            }
            if (input) {
                input.value = '';
            }
        } else {
            if (input) {
                input.value = '';
            }
        }
    }

    remove(tag: SearchTag): void {
        const index = this.searchTags.indexOf(tag);
        if (index >= 0) {
            this.searchTags.splice(index, 1);
        }
    }

    StartQuery() {
        this.directoryservice.queryExists(
            this.directoryservice.selectedUser, this.directoryservice.selectedProject, this.queryName + '.json')
            .subscribe((queryExists) => {
                if (queryExists === true) {
                    const hasConfirmed = confirm('Ved at acceptere følgende sletter du en tidligere søgning med samme navn')
                    if (hasConfirmed === true) {
                        this.showLoading = true;
                        this.directoryservice.selectedQuery = this.queryName + '.json';
                        this.SaveQuery();
                    }
                } else {
                    this.showLoading = true;
                    this.directoryservice.selectedQuery = this.queryName + '.json';
                    this.SaveQuery();
                }
            });
    }

    SaveQuery() {
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

        this.fbservice.DoSearchForPosts(exportQuery).then((response) => {
            const postList = [];
            response.forEach(postArray => {
                postArray.forEach((data) => {
                    postList.push(data);
                });
            });

            this.directoryservice.createQueryJSON(
                this.directoryservice.selectedUser,
                this.directoryservice.selectedProject,
                new Query(
                    exportQuery.name,
                    exportQuery.params,
                    exportQuery.timeperiod,
                    exportQuery.groups,
                    exportQuery.filter,
                    postList
                )
            );

            this.router.navigate(['/projekt', exportQuery.name]);
        });
    }

    ngAfterContentInit(): void {
        this.directoryservice.getProject(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((projects: string) => {
                const tempProject: Project = JSON.parse(projects);
                this.groupsAvailable = tempProject.group;
            });
    }
}
