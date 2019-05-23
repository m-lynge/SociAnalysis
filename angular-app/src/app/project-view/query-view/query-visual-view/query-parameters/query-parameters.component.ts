import {Component, OnDestroy, OnInit} from '@angular/core';
import {Query} from '../../../../Query';
import {DirectoryService} from 'src/app/directory.service';
import {QueryService} from 'src/app/query.service';

@Component({
    selector: 'app-query-parameters',
    templateUrl: './query-parameters.component.html',
    styleUrls: ['./query-parameters.component.css']
})

export class QueryParametersComponent implements OnInit, OnDestroy {
    QueryParams: Query = new Query('', [], {from: '', till: ''}, [], {max: 0, tags: []}, []);
    amountOfPosts: number;
    dataReady: boolean;
    private subscription;

    constructor(private directoryservice: DirectoryService, private queryservice: QueryService) {
    }

    ngOnInit() {
        this.subscription = this.queryservice.selectedQuerySubject.subscribe((data) => {
            // ml19
            console.log('Query-parameters: selectedQuerySubject');
            this.QueryParams = data;
            if (this.QueryParams.hasOwnProperty('fbData') === true) {
                this.amountOfPosts = this.QueryParams.fbData.length;
            } else {
                this.amountOfPosts = 0;
            }
        });
    }

    ngOnDestroy() {
        // ml19
        console.log('Query-parameters: unsubscribe');
        this.subscription.unsubscribe();
    }


}
