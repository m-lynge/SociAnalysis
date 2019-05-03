import { AfterViewInit, Component } from '@angular/core';
import { DirectoryService } from "../../../directory.service";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { Router } from '@angular/router';
import { NewProjectService } from 'src/app/new-project.service';
import { NavigationService } from 'src/app/navigation.service';
import { QueryService } from 'src/app/query.service';


@Component({
    selector: 'app-query-menu',
    templateUrl: './query-menu.component.html',
    styleUrls: ['./query-menu.component.css']
})
export class QueryMenuComponent implements AfterViewInit {

    constructor(private directoryservice: DirectoryService,
                private router: Router,
                private newprojectservice: NewProjectService,
                private navigationservice: NavigationService,
                public queryservice: QueryService,
                ) {}

    data: any;

    ngAfterViewInit() {
        this.directoryservice.getAllQueries(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
            .subscribe((queryArray) => {

                if (queryArray && queryArray[0]) {
                    // console.log('selected query: ', this.directoryservice.selectedQuery);
                    if (!this.directoryservice.selectedQuery) {
                        // console.log('if selected user not');
                        this.directoryservice.selectedQuery = queryArray[0];
                    }
                    // console.log('QMC: getSelectedQuery()');
                    this.queryservice.getSelectedQuery();
                    this.queryservice.hasQuerys = true;
                } else {
                    console.log('Query-menu: No query Array!');
                    this.queryservice.hasQuerys = false;

                }

            });

    }

    newQuery() {
        this.navigationservice.GoBackRoute = ['/projekt', ''];
        this.router.navigate(['/project_ny_soegning']);
        // routerLink = "/project_ny_soegning"
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
                    emptyArray.push({ message: postMessage, id: postID });
                }
            });

            // console.log(emptyArray);

            const options = {
                fieldSeparator: ';',
                decimalseparator: ';'
            };
            const messages = new Angular5Csv( emptyArray, 'My Report', options );
        });


    }
}
