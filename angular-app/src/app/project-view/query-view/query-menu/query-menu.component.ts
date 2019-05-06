import {AfterViewInit, Component} from '@angular/core';
import {DirectoryService} from '../../../directory.service';
import {Router} from '@angular/router';
import {NavigationService} from 'src/app/navigation.service';
import {QueryService} from 'src/app/query.service';
import {FBServiceService} from 'src/app/fb-service.service';
import {NewQuery} from 'src/app/NewQuery';
import {Query} from 'src/app/Query';
import {MatDialog, MatDialogRef} from "@angular/material";
import {Angular5Csv} from "angular5-csv/dist/Angular5-csv";
import { NewProjectService } from 'src/app/new-project.service';

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
    ) {
    }



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
    deleteQuery() {
        this.directoryservice.removeQuerry(this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery );
        this.directoryservice.selectedQuery = '';
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

    exportComments() {
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery
        ).then((data) => {
            this.data = data.fbData;
            const emptyArray: object[] = [];
            data.fbData.forEach(comment => {
                if (comment.comments) {
                    comment.comments.data.forEach(tempCon => {


                        let permalink;
                        let createdTime;

                        if (tempCon.created_time) {
                            createdTime = tempCon.created_time;
                        } else {
                            createdTime = 'NaN';
                        }



                        if (tempCon.permalink_url) {
                            permalink = tempCon.permalink_url;
                        }

                        console.log(tempCon);
                        emptyArray.push({
                            message: tempCon.message,
                            id: tempCon.id,
                            likes: tempCon.like_count,
                            link: permalink,
                            created_Time: createdTime
                        });
                    });

                }
            });

            const options = {
                fieldSeparator: ';',
                decimalseparator: ';',
                showLabels: true,
                headers: ['Besked', 'ID', 'Likes', 'Link', 'Oprettet dato']

            };
            // const messages = new Angular5Csv(emptyArray, 'KOMMENTARER', options);
        });
    }


    exportMessage() {
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery
        ).then((data) => {
            this.data = data.fbData;
            const emptyArray: object[] = [];
            data.fbData.forEach(post => {

                if (post.message) {
                    const usesLikes = data.params.includes('likes');
                    const usesUrl = data.params.includes('link');
                    let likesAmount;
                    let url;
                    let createdTime;

                    if (usesLikes && post.likes) {
                        likesAmount = post.likes.data.length;
                    } else if (usesLikes) {
                        likesAmount = 0;
                    } else {
                        likesAmount = 'NaN';
                    }

                    if (usesUrl && post.link) {
                        url = post.link;
                    } else if (usesUrl) {
                        url = '';
                    } else {
                        url = 'NaN';
                    }
                    console.log(post);
                    if (post.created_time) {
                        createdTime = post.created_time;
                    } else {
                        createdTime = 'NaN';
                    }

                    const postMessage = post.message.replace(/(\r\n|\n|\r|,)/gm, '');
                    const postID = post.id;

                    emptyArray.push({
                        message: postMessage,
                        id: postID,
                        likes: likesAmount,
                        link: url,
                        oprettet_dato: createdTime
                    });

                }
            });

            const options = {
                fieldSeparator: ';',
                decimalseparator: ';',
                showLabels: true,
                headers: ['Besked', 'ID', 'Likes', 'URL', 'Oprettet Dato']

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
