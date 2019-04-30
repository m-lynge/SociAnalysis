import { Injectable} from '@angular/core';
import { Query } from './Query';
import { DirectoryService } from './directory.service';
import { Subject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private selectedQuery: Query;
  private allPostsText: string;
  hasQuerys = false;
  allPostsTextSubject: Subject<string> = new Subject<string>();
  selectedQuerySubject: Subject<Query> = new Subject<Query>();

  constructor(private directoryservice: DirectoryService) { }

  getSelectedQuery() {
      this.directoryservice.getQuery(
        this.directoryservice.selectedUser,
        this.directoryservice.selectedProject,
        this.directoryservice.selectedQuery).then((data => {
          this.selectedQuery = data;
          this.selectedQuerySubject.next(this.selectedQuery);
          this.makeAllPostsToString();
          console.log(data);
        } ));
  }

  makeAllPostsToString() {
    // Make the one string here ----HEINE -----
    this.allPostsText = 'a a a a a a is is is ist ist ist ist test test test test test';
    this.allPostsTextSubject.next(this.allPostsText);
  }
}
