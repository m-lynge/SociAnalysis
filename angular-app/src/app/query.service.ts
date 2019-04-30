import { Injectable} from '@angular/core';
import { Query } from './Query';
import { DirectoryService } from './directory.service';
import { Subject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private selectedQuery: Query;
  selectedQuerySubject: Subject<Query> = new Subject<Query>();
  constructor(private directoryservice: DirectoryService) { }

  getSelectedQuery() {
      this.directoryservice.getQuery(
        this.directoryservice.selectedUser,
        this.directoryservice.selectedProject,
        this.directoryservice.selectedQuery).then((data => {
          this.selectedQuery = data;
          this.selectedQuerySubject.next(this.selectedQuery);
          console.log(data);
        } ));

  }
}
