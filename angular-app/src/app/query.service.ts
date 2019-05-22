import { Injectable } from '@angular/core';
import { Query } from './Query';
import { DirectoryService } from './directory.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QueryService {
    public isLoading: boolean = false;
    private selectedQuery: Query;
    private allPostsText: string;
    hasQuerys = false;
    allPostsTextSubject: Subject<string> = new Subject<string>();
    selectedQuerySubject: Subject<Query> = new Subject<Query>();
    queryArray;
    stopWordsActive = true;

    constructor(private directoryservice: DirectoryService) {
    }

    getSelectedQuery() {
        this.directoryservice.getQuery(
            this.directoryservice.selectedUser,
            this.directoryservice.selectedProject,
            this.directoryservice.selectedQuery).
            then((data => {
                this.selectedQuery = data;
                this.translateParameters();
                this.makeAllPostsToString();
                this.selectedQuerySubject.next(this.selectedQuery);
            }));
    }

    makeAllPostsToString() {
        if (this.selectedQuery.fbData) {
            const fbData = this.selectedQuery.fbData;
            fbData.forEach((post: any) => {
                if (post.hasOwnProperty('message')) {
                    this.allPostsText += ' ' + post.message;
                }

                if (post.hasOwnProperty('comments')) {
                    post.comments.data.forEach((fun: any) => {
                        if (fun.hasOwnProperty('message')) {
                            this.allPostsText += ' ' + fun.message;
                        }
                    });

                }
            });
        }
        this.allPostsTextSubject.next(this.allPostsText);
        this.allPostsText = '';
    }
    translateParameters() {
        this.selectedQuery.params.forEach((params, index) => {
            if (params === 'message') {
                this.selectedQuery.params[index] = 'besked';
            }
            if (params === 'comments') {
                this.selectedQuery.params[index] = 'kommentarer';
            }
            if (params === 'reactions') {
                this.selectedQuery.params[index] = 'reaktioner';
            }
            if (params === 'picture') {
                this.selectedQuery.params[index] = 'billeder';
            }
        });
    }
}
