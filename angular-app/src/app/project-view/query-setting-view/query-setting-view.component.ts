import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE, B } from '@angular/cdk/keycodes';
import { Group } from '../../Group';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DirectoryService } from 'src/app/directory.service';
import { FBServiceService } from 'src/app/fb-service.service';
import { Query } from '../../Query';
import { Project } from '../../Project';
import { NewQuery } from 'src/app/NewQuery';
import { Router } from '@angular/router';

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
                this.searchTags.push({ tag: value.trim() });
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
                    const hasConfirmed = confirm('Ved at acceptere følgende sletter du en tidligere søgning med samme navn');
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
            { name: 'message', clicked: this.postsCheck.value },
            { name: 'comments', clicked: this.commentsCheck.value },
            { name: 'likes', clicked: this.likesCheck.value },
            { name: 'reactions', clicked: this.reactionsCheck.value },
            { name: 'permalink_url', clicked: this.linksCheck.value }
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
                // console.log('VALUE', this.endDate.value.getMonth());
                // console.log('test1', this.endDate.value.getDate());
                // console.log('test2', this.endDate.value.getFullYear());
                // console.log('test3', this.endDate.value.getUTCMonth());
                // console.log('test4', this.endDate.value.getUTCDate());
                // console.log('test5', this.endDate.value.getUTCFullYear());
                // console.log('test6', this.endDate.value.toDateString());


                // console.log('pre', this.beginDate.value.getDay());
                // console.log('beginDAY', this.fixDate(Number(this.beginDate.value.getDay())));
                // console.log('pre', this.beginDate.value.getMonth());
                // console.log('beginDATE', this.fixDate(Number(this.beginDate.value.getMonth())));

                // console.log('pre', this.endDate.value.getDay());
                // console.log('endDAY', this.fixDate(Number(this.endDate.value.getDay())));
                // console.log('pre', this.endDate.value.getMonth());
                // console.log('endDATE', this.fixDate(Number(this.endDate.value.getMonth())));
                // console.log('endDATE', this.fixDate(Number(this.endDate.value.getUTCDate())));
                const beginUTFDate = (this.beginDate.value.getFullYear()) + '-'
                    + this.fixDate(Number(this.beginDate.value.getMonth()) + 1) + '-'
                    + this.fixDate(Number(this.beginDate.value.getDate()));


                const endUTFDate = (this.endDate.value.getFullYear()) + '-'
                    + this.fixDate(Number(this.endDate.value.getMonth()) + 1) + '-'
                    + this.fixDate(Number(this.endDate.value.getDate()));

                beginDate = beginUTFDate.replace(/' '/g, '');
                endDate = endUTFDate.replace(/' '/g, '');
            }
        } else {
            beginDate = '';
            endDate = '';
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
            filter: { max: this.maxInput.value, tags: chosenTags }
        };

        this.fbservice.DoAPISearchForQuery(exportQuery).then((response) => {
            const postList = [];
            response.forEach(postArray => {
                postArray.forEach((data) => {
                    postList.push(data);
                });
            });

            // do filtering based on filter
            const filteredArray = this.fbservice.filterQuery(postList, exportQuery.filter.tags,
                this.useDate.value, beginDate, endDate);

            console.log('POSTDATA', postList);
            console.log('FILTEREDDATA', filteredArray);
            this.directoryservice.createQueryJSON(
                this.directoryservice.selectedUser,
                this.directoryservice.selectedProject,
                new Query(
                    exportQuery.name,
                    exportQuery.params,
                    exportQuery.timeperiod,
                    exportQuery.groups,
                    exportQuery.filter,
                    filteredArray
                )
            );
            this.router.navigate(['/projekt']);
        });
    }

    fixDate(date: number): string {
        let returnDate = '';
        if (date < 10) {
            returnDate = '0' + date;
        } else {
            returnDate = '' + date;
        }
        return returnDate;
    }

    filterByDate(beginDate, endDate, contentToFilter): any[] {
        return contentToFilter.filter((post: any) => {
            const returnBool = false;
            console.log('beginDate:', beginDate, ' , endDate:', endDate);
            console.log('post:', post.created_time.split('T')[0]);
            console.log(' is within:', this.withinDates(post.created_time.split('T')[0], beginDate, endDate));
            if (this.withinDates(post.created_time.split('T')[0], beginDate, endDate) === true) {
                return post;
            }
        });
    }
    withinDates(check: string, beginDate: string, endDate: string): boolean {
        const cDate = Date.parse(check);
        const bDate = Date.parse(beginDate);
        const eDate = Date.parse(endDate);

        if ((cDate <= eDate && cDate >= bDate)) {
            return true;
        }
        return false;
    }

    filterByTag(tags: string[], contentToFilter): any[] {
        const returnContent = contentToFilter.filter((post: any) => {
            // if post message
            let returnBool = false;
            tags.forEach((tag) => {
                if (post.hasOwnProperty('message')) {
                    if (post.message.includes(tag)) {
                        console.log('postmessage: ', post.message, ' - includes: ', tag);
                        returnBool = true;
                    }
                }
                if (returnBool !== true) {
                    // if comment message
                    if (post.hasOwnProperty('comments')) {
                        post.comments.data.forEach(comment => {
                            if (comment.hasOwnProperty('message')) {
                                if (comment.message.includes(tag)) {
                                    console.log('commentmessage: ', comment.message, ' - includes: ', tag);
                                    returnBool = true;
                                }
                            }
                            if (returnBool !== true) {
                                // if comment's commment message
                                if (comment.hasOwnProperty('comments')) {
                                    comment.comments.data.forEach(commentOfcomment => {
                                        if (commentOfcomment.hasOwnProperty('message')) {
                                            if (commentOfcomment.message.includes(tag)) {
                                                console.log('commentofcommentmessage: ',
                                                    commentOfcomment.message, ' - includes: ', tag);
                                                returnBool = true;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
            return returnBool === true;
        });
        return returnContent;
    }

    ngAfterContentInit(): void {
        this.directoryservice.getProject(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((projects: string) => {
                const tempProject: Project = JSON.parse(projects);
                this.groupsAvailable = tempProject.group;
            });
    }
}
