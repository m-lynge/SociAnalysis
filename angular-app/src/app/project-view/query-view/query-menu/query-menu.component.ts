import { AfterViewInit, Component } from '@angular/core';
import { DirectoryService } from '../../../directory.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { Router } from '@angular/router';
import { NewProjectService } from 'src/app/new-project.service';
import { NavigationService } from 'src/app/navigation.service';
import { QueryService } from 'src/app/query.service';
import { FBServiceService } from 'src/app/fb-service.service';
import { NewQuery } from 'src/app/NewQuery';
import { Query } from 'src/app/Query';
import { MatDialog, MatDialogRef } from '@angular/material';

// interface ExportJSONQuery {
//     groups: [{
//         post: [{

//         }]
//     }]
// }

@Component({
    selector: 'app-query-menu',
    templateUrl: './query-menu.component.html',
    styleUrls: ['./query-menu.component.css']
})
export class QueryMenuComponent implements AfterViewInit {

    constructor(private directoryservice: DirectoryService,
                private router: Router,
                private navigationservice: NavigationService,
                private fbservice: FBServiceService,
                public queryservice: QueryService,
                public dialog: MatDialog
    ) { }




    ngAfterViewInit() {
        this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((queryArray) => {
                if (queryArray && queryArray[0]) {
                    if (!this.directoryservice.selectedQuery || this.directoryservice.selectedQuery === '') {
                        this.directoryservice.selectedQuery = queryArray[0];
                    }
                    this.queryservice.getSelectedQuery();
                    this.queryservice.hasQuerys = true;
                } else {
                    this.queryservice.hasQuerys = false;
                }
            });
    }

    newQuery() {
        this.navigationservice.GoBackRoute = ['/projekt'];
        this.router.navigate(['/project_ny_soegning']);
    }

    updateQuery() {
        this.queryservice.isLoading = true;
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery
        ).then((data: Query) => {
            const newquery = new NewQuery(data.name, data.params, data.timeperiod, data.groups, data.filter);
            this.fbservice.DoAPISearchForQuery(newquery).then((response) => {
                const postList = [];

                response.forEach(postArray => {
                    postArray.forEach((fbData) => {
                        postList.push(fbData);
                    });
                });

                const query = new Query(
                    data.name,
                    data.params,
                    data.timeperiod,
                    data.groups,
                    data.filter,
                    postList);
                this.directoryservice.createQueryJSON(
                    this.directoryservice.selectedUser,
                    this.directoryservice.selectedProject,
                    query
                );
                this.queryservice.isLoading = false;
            });


        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ExportDialogComponent, {
            width: '500px'
        });
    }

    exportQuery() {

    }
}

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'exportDialog.html',
    styleUrls: ['./dialog.css']
})
export class ExportDialogComponent {

    data: any;

    constructor(
        public dialogRef: MatDialogRef<ExportDialogComponent>, private directoryservice: DirectoryService) {
    }

    public exportMessage() {
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery
        ).then((data) => {
            this.data = data.fbData;
            const emptyArray: object[] = [];
            data.fbData.forEach(post => {

                if (post.message) {
                    const postMessage = post.message.replace(/(\r\n|\n|\r|,)/gm, '');
                    const postID = post.id;
                    emptyArray.push({ message: postMessage, id: postID });
                }
            });

            const options = {
                fieldSeparator: ';',
                decimalseparator: ';'
            };
            const messages = new Angular5Csv(emptyArray, 'BESKEDER', options);
        });
    }



    exportJSON() {
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery
        ).then((data: Query) => {
            console.log('data: ');
            console.log(data);

        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
