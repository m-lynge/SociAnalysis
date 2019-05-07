import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FBServiceService } from "../../fb-service.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { NewQuery } from "../../NewQuery";
import { DirectoryService } from "../../directory.service";
import { Project } from "../../Project";
import { Group } from "../../Group";
import { Query } from "../../Query";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export interface name {
    name: string;
}


@Component({
    selector: 'app-query-type-selection-view',
    templateUrl: './query-type-selection-view.component.html',
    styleUrls: ['./query-type-selection-view.component.css']
})
export class QueryTypeSelectionViewComponent implements OnInit {

    private listOfGroups: Group[] = [];
    private name = '';
    private isLoading = false;


    constructor(
        private fbService: FBServiceService,
        private dialog: MatDialog,
        private directoryservice: DirectoryService,
        private router: Router) {
    }

    @Output()
    exportView: EventEmitter<string> = new EventEmitter();


    ngOnInit() {
        this.directoryservice.getProject(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((projects: string) => {
                const tempProject: Project = JSON.parse(projects);
                this.listOfGroups = tempProject.group;
            });
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '300px',
            data: { name: this.name }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.name = result;

            if (result) {
                const exportQuery: NewQuery = new NewQuery(
                    this.name,
                    ['message', 'comments', 'likes', 'reactions', 'permalink_url'],
                    { from: '', till: '' },
                    this.listOfGroups,
                    { max: 100, tags: [] }
                );

                this.directoryservice.queryExists(
                    this.directoryservice.selectedUser, this.directoryservice.selectedProject, this.name + '.json')
                    .subscribe((queryExists) => {
                        if (queryExists === true) {
                            const hasConfirmed = confirm('Ved at acceptere følgende sletter du en tidligere søgning med samme navn')
                            if (hasConfirmed === true) {
                                this.isLoading = true;
                                this.directoryservice.selectedQuery = this.name + '.json';
                                this.saveQuery(exportQuery);
                            }
                        } else {
                            this.isLoading = true;
                            this.saveQuery(exportQuery);
                            this.directoryservice.selectedQuery = this.name + '.json';
                        }
                    });
            }
        });
    }

    changeView(input: string) {
        if (input === 'brugerdefineret') {
            this.exportView.emit('1');
        } else if (input === 'standard') {
            this.exportView.emit('2');
        }
    }

    saveQuery(exportQuery) {

        this.fbService.DoAPISearchForQuery(exportQuery).then((response) => {
            const postList = [];

            response.forEach(postArray => {
                postArray.forEach((data) => {
                    postList.push(data);
                });
            });

            const query = new Query(
                exportQuery.name,
                exportQuery.params,
                exportQuery.timeperiod,
                exportQuery.groups,
                exportQuery.filter,
                postList);
            this.directoryservice.createQueryJSON(
                this.directoryservice.selectedUser,
                this.directoryservice.selectedProject,
                query
            );

            this.router.navigate(['/projekt']);


        });
    }

}

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'dialog.html',
})
export class DialogOverviewExampleDialogComponent implements OnInit {

    myForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: name, private formBuilder: FormBuilder) {
    }


    ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚÆØÅæøå ]+$')
            ]]
        });
    }

    get name() {
        return this.myForm.get('name');
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

}
