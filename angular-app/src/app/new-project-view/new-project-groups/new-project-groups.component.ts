import { AfterContentInit, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { Group } from "../../Group";
import { SearchTag } from 'src/app/project-view/query-setting-view/query-setting-view.component';
import { NewProjectService } from 'src/app/new-project.service';
import { DirectoryService } from 'src/app/directory.service';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/navigation.service';
import { Query } from 'src/app/Query';
import { group } from '@angular/animations';


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

    groupsShown: Group[];
    groupsSelected: Group[] = [];

    showList = false;

    constructor(
        public newprojectservice: NewProjectService,
        private directoryservice: DirectoryService,
        private router: Router,
        private navigationservice: NavigationService) {
    }


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
            // If groups already fetched from facebook:
            if (this.newprojectservice.listOfAllGroups.length > 0) {
                this.groupsShown = this.newprojectservice.listOfAllGroups;
                this.showList = true;
                if (this.newprojectservice.listOfSelectedGroups.length > 0) {
                    this.groupsSelected = this.newprojectservice.listOfSelectedGroups;
                }
                // Else subscribe on observable for later update:
            } else {
                this.newprojectservice.laterPushOfAllGroups.subscribe((value) => {
                    this.groupsShown = value;
                    this.showList = true;
                    if (this.newprojectservice.listOfSelectedGroups.length > 0) {
                        this.groupsSelected = this.newprojectservice.listOfSelectedGroups;
                    }

                });
            }

            // if it is a already existing project
        } else {
            this.newprojectservice.laterPushOfAllGroups.subscribe((value) => {
                this.groupsShown = value;
                this.showList = true;
            });

            this.newprojectservice.laterPushOfSelectedGroups.subscribe((value) => {
                this.groupsSelected = value;
            });
        }
    }


    findMatchingGroups(): void {
        if (this.searchTerm === '') {
            console.log('emtpy');
            let segmentedGroups = this.newprojectservice.listOfAllGroups.filter(n => !this.groupsSelected.includes(n));

            this.groupsShown = segmentedGroups;
        } else {
            console.log('available?', this.newprojectservice.listOfAllGroups);
            // let segmentedGroups = this.newprojectservice.listOfAllGroups.filter(n => !this.groupsSelected.includes(n));

            // console.log('segmentedGroups:', segmentedGroups);
            let segmentedGroups = this.newprojectservice.listOfAllGroups.filter(n => !this.groupsSelected.includes(n));

            this.groupsShown = segmentedGroups.filter((group: Group) => {
                return group.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
            });
        }
 
    }

    showNext(): void {
        if (this.groupsSelected.length > 0) {
            if (this.newprojectservice.NewProject) {
                this.newprojectservice.listOfSelectedGroups = this.groupsSelected;
                this.newprojectservice.Toggle = 2;
            } else {
                // if no queries includes the groups unselected
                this.directoryservice.getAllQueries(
                    this.directoryservice.selectedUser, this.directoryservice.selectedProject)
                    .subscribe(async (AllQueries) => {
                        if (AllQueries) {
                            const promises = AllQueries.map(async query => {
                                return this.directoryservice.getQuery(
                                    this.directoryservice.selectedUser, this.directoryservice.selectedProject, query);
                            });

                            return await Promise.all(promises).then((queryies: any) => {
                                const conflictGroupsAndQueries = this.groupAttatchedToQuery(this.groupsShown, queryies);
                                if (conflictGroupsAndQueries.length > 0) {
                                    let alertString = '';
                                    conflictGroupsAndQueries.forEach(element => {
                                        alertString = alertString + ' Gruppen: ' + JSON.stringify(element.groupInstance.name);
                                        alertString = alertString + ' - er brugt i: ';
                                        if (element.usedInQueries.length > 1) {
                                            for (let index = 0; index < element.usedInQueries.length; index++) {
                                                alertString = alertString + JSON.stringify(element.usedInQueries[index].name);
                                                if (index !== element.usedInQueries.length - 1) {
                                                    alertString = alertString + ' og ';
                                                }
                                            }
                                        } else {
                                            alertString = alertString + JSON.stringify(element.usedInQueries[0].name);
                                        }
                                    });
                                    alert('Gem kan ikke gennemføres da: ' + '\n' + alertString +
                                        ' og kan derfor ikke fjernes fra projektet');
                                } else {
                                    this.newprojectservice.saveProject();
                                }
                            });
                        }
                    });
            }
        } else {
            alert('Minimum en gruppe skal være tilknyttet et projekt');
        }

    }

    groupAttatchedToQuery(groups: Group[], allQueries: Query[]): any {
        let returnBool: boolean = false;

        const affectedGroups = groups.map((groupInstance) => {
            const usedInQueries = allQueries.filter((query: Query) => {
                let bool = false;
                query.groups.forEach((queryGroup) => {
                    if (queryGroup.id === groupInstance.id) {
                        bool = true;
                    } else {
                        if (bool !== true) {
                            bool = false;
                        }
                    }
                });
                return bool;
            });
            if (usedInQueries.length > 0) {
                return { usedInQueries, groupInstance };
            } else {
                return;
            }
        });

        return affectedGroups.filter((affectedGroup) => {
            return (affectedGroup);
        });
    }

}
