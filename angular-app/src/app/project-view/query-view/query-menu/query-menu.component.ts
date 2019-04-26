import {AfterViewInit, Component} from '@angular/core';
import {DirectoryService} from "../../../directory.service";


@Component({
    selector: 'app-query-menu',
    templateUrl: './query-menu.component.html',
    styleUrls: ['./query-menu.component.css']
})
export class QueryMenuComponent implements AfterViewInit {

    constructor(private directoryservice: DirectoryService) {
    }

    data: any;

    downloadFile(data: any) {

        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');

        const a = document.createElement('a');

        const blob = new Blob(["\ufeff", csvArray], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);


        a.href = url;
        a.download = 'myFile.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

    }

    ngAfterViewInit() {
        this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((queryArray) => {
                console.log('queries: ', queryArray);
                if (queryArray[0]) {
                    this.directoryservice.selectedQuery = queryArray[0];
                } else {
                    console.log("No query Array!");
                }
                console.log('path: ' + this.directoryservice.selectedQuery);
                this.directoryservice.getQuery(
                    this.directoryservice.selectedUser,
                    this.directoryservice.selectedProject,
                    this.directoryservice.selectedQuery
                ).then((data) => {
                    this.data = data.fbData;
                });

            });

    }


    newQuery() {
        console.log('new query clicked');
    }

    updateQuery() {
        console.log('update query clicked');
    }

    exportQuery() {

        console.log(this.data)
        this.downloadFile(this.data);
    }
}
