import {AfterViewInit, Component} from '@angular/core';
import {DirectoryService} from '../../../directory.service';
import {Router} from '@angular/router';
import {NavigationService} from 'src/app/navigation.service';
import {QueryService} from 'src/app/query.service';
import {FBServiceService} from 'src/app/fb-service.service';
import {NewQuery} from 'src/app/NewQuery';
import {Query} from 'src/app/Query';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
import {DomSanitizer} from '@angular/platform-browser';
import * as FileSaver from 'file-saver';

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

    updateList() {
        // ml19
        console.log('calling update list');
        this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((queryArray) => {
                // ml19
                console.log('Query-meny: ', queryArray);
                if (queryArray && queryArray[0]) {
                    console.log('Query-menu: calling get selected query');
                    if (!this.directoryservice.selectedQuery || this.directoryservice.selectedQuery === '') {
                        this.directoryservice.selectedQuery = queryArray[0];
                    }
                    this.queryservice.queryArray = [];
                    this.queryservice.queryArray = queryArray;
                    this.queryservice.getSelectedQuery();
                    this.queryservice.hasQuerys = true;
                } else {
                    this.queryservice.hasQuerys = false;
                }
            });
    }

    ngAfterViewInit() {
        this.updateList();
    }

    newQuery() {
        this.navigationservice.GoBackRoute = ['/projekt'];
        this.router.navigate(['/project_ny_soegning']);
    }

    deleteQuery() {
        if (confirm('Dette vil slette søgningen: ' + this.directoryservice.selectedQuery + ' - og alt dets data')) {
            this.directoryservice.removeQuerry(this.directoryservice.selectedUser,
                this.directoryservice.selectedProject,
                this.directoryservice.selectedQuery).then(() => {
                this.directoryservice.selectedQuery = '';
                this.updateList();
            });
        }
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

                let useDate = false;
                if (newquery.timeperiod.from !== '') {
                    useDate = true;
                }
                // do filtering based on filter
                const filteredArray = this.fbservice.filterQuery(postList, newquery.filter.tags,
                    useDate, newquery.timeperiod.from, newquery.timeperiod.till);

                this.queryservice.isLoading = false;
                const query = new Query(
                    data.name,
                    data.params,
                    data.timeperiod,
                    data.groups,
                    data.filter,
                    filteredArray);
                this.directoryservice.createQueryJSON(
                    this.directoryservice.selectedUser,
                    this.directoryservice.selectedProject,
                    query
                );

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
                        let likeCount = 0;
                        let loveCount = 0;
                        let hahaCount = 0;
                        let wowCount = 0;
                        let sadCount = 0;
                        let angryCount = 0;
                        let permalink;
                        let createdTime;

                        if (tempCon.comments) {
                            tempCon.comments.data.forEach(conInCon => {

                                let likeCountTemp = 0;
                                let loveCountTemp = 0;
                                let hahaCountTemp = 0;
                                let wowCountTemp = 0;
                                let sadCountTemp = 0;
                                let angryCountTemp = 0;

                                if (conInCon.hasOwnProperty('reactions')) {
                                    conInCon.reactions.data.forEach(react => {

                                        switch (react.type) {
                                            case 'LIKE': {
                                                likeCountTemp++;
                                                break;
                                            }
                                            case 'LOVE': {
                                                loveCountTemp++;
                                                break;
                                            }
                                            case 'HAHA': {
                                                hahaCountTemp++;
                                                break;
                                            }
                                            case 'WOW': {
                                                wowCountTemp++;
                                                break;
                                            }
                                            case 'SAD': {
                                                sadCountTemp++;
                                                break;
                                            }
                                            case 'ANGRY': {
                                                angryCountTemp++;
                                                break;
                                            }
                                        }
                                    });
                                }

                                emptyArray.push({
                                    message: conInCon.message,
                                    id: conInCon.id,
                                    link: conInCon.permalink_url,
                                    created_Time: conInCon.created_time,
                                    likeCounts: likeCountTemp,
                                    loveCounts: loveCountTemp,
                                    hahaCounts: hahaCountTemp,
                                    wowCounts: wowCountTemp,
                                    sadCounts: sadCountTemp,
                                    angryCounts: angryCountTemp,
                                });
                            });
                        }

                        if (tempCon.hasOwnProperty('reactions')) {
                            tempCon.reactions.data.forEach(react => {

                                switch (react.type) {
                                    case 'LIKE': {
                                        likeCount++;
                                        break;
                                    }
                                    case 'LOVE': {
                                        loveCount++;
                                        break;
                                    }
                                    case 'HAHA': {
                                        hahaCount++;
                                        break;
                                    }
                                    case 'WOW': {
                                        wowCount++;
                                        break;
                                    }
                                    case 'SAD': {
                                        sadCount++;
                                        break;
                                    }
                                    case 'ANGRY': {
                                        angryCount++;
                                        break;
                                    }
                                }
                            });
                        }

                        if (tempCon.created_time) {
                            createdTime = tempCon.created_time;
                        } else {
                            createdTime = 'NaN';
                        }


                        if (tempCon.permalink_url) {
                            permalink = tempCon.permalink_url;
                        }

                        // console.log(tempCon);
                        emptyArray.push({
                            message: tempCon.message,
                            id: tempCon.id,
                            link: permalink,
                            created_Time: createdTime,
                            likeCounts: likeCount,
                            loveCounts: loveCount,
                            hahaCounts: hahaCount,
                            wowCounts: wowCount,
                            sadCounts: sadCount,
                            angryCounts: angryCount,
                        });
                    });

                }
            });

            const options = {
                fieldSeparator: ';',
                decimalseparator: ';',
                showLabels: true,
                headers: ['Besked', 'ID', 'Link', 'Oprettet dato', 'LikeCount'
                    , 'loveCount'
                    , 'hahaCount'
                    , 'wowCount'
                    , 'sadCount'
                    , 'angryCount']

            };
            const messages = new Angular5Csv(emptyArray, 'KOMMENTARER', options);
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
                    const usesLikes = data.params.includes('reactions');
                    const usesUrl = data.params.includes('permalink_url');
                    let likesAmount;
                    let url;
                    let createdTime;

                    let likeCount = 0;
                    let loveCount = 0;
                    let hahaCount = 0;
                    let wowCount = 0;
                    let sadCount = 0;
                    let angryCount = 0;

                    if (usesLikes && post.reactions) {
                        post.reactions.data.forEach(react => {
                            switch (react.type) {
                                case 'LIKE': {
                                    likeCount++;
                                    break;
                                }
                                case 'LOVE': {
                                    loveCount++;
                                    break;
                                }
                                case 'HAHA': {
                                    hahaCount++;
                                    break;
                                }
                                case 'WOW': {
                                    wowCount++;
                                    break;
                                }
                                case 'SAD': {
                                    sadCount++;
                                    break;
                                }
                                case 'ANGRY': {
                                    angryCount++;
                                    break;
                                }
                            }
                        });
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
                        permaLink: post.permalink_url,
                        oprettet_dato: createdTime,
                        likeCounts: likeCount,
                        loveCounts: loveCount,
                        hahaCounts: hahaCount,
                        wowCounts: wowCount,
                        sadCounts: sadCount,
                        angryCounts: angryCount,
                    });

                }
            });

            const options = {
                fieldSeparator: ';',
                decimalseparator: ';',
                showLabels: true,
                headers: ['Besked', 'ID', 'Link', 'Oprettet Dato', 'LikeCount'
                    , 'loveCount'
                    , 'hahaCount'
                    , 'wowCount'
                    , 'sadCount'
                    , 'angryCount']

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


            const theJSON = JSON.stringify(data.fbData);
            const datas = new Blob([theJSON], { type: 'text/json;charset=utf-8' });
            FileSaver.saveAs(datas, this.directoryservice.selectedQuery);

        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
