import {AfterViewInit, Component} from '@angular/core';
import {DirectoryService} from "../../../directory.service";
import {Angular5Csv} from "angular5-csv/dist/Angular5-csv";


@Component({
    selector: 'app-query-menu',
    templateUrl: './query-menu.component.html',
    styleUrls: ['./query-menu.component.css']
})
export class QueryMenuComponent implements AfterViewInit {

    constructor(private directoryservice: DirectoryService) {
    }

    data: any;

    ngAfterViewInit() {
        this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((queryArray) => {

                if (queryArray[0]) {
                    this.directoryservice.selectedQuery = queryArray[0];
                } else {
                    console.log("Query-menu: No query Array!");
                }

            });

    }

    updateQuery() {
    }

    exportQuery() {
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery
        ).then((data) => {
            this.data = data.fbData;
            let emptyArray: object[] = [];
            data.fbData.forEach(post => {

                if (post.message) {
                    const postMessage = post.message.replace(/(\r\n|\n|\r|,)/gm, '');
                    const postID = post.id;
                    emptyArray.push({message: postMessage, id: postID});
                }
            });

            // console.log(emptyArray);

            const messages = new Angular5Csv(emptyArray, 'My Report');
        });


    }
}
