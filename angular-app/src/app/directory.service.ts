import { Injectable } from '@angular/core';
import { Selected } from './Selected';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './Group';

@Injectable({
  providedIn: 'root'
})

interface Project {
  title: string;
  description: string;
  group: Group[];
}


export class DirectoryService {

  private uri = 'http://localhost:4000/directory';
  private selected: Selected;

  constructor(private http: HttpClient, ) {
    this.selected = new Selected(null, null, null);
  }

  //Getters and setters for selecting user
  public get selectedUser(): string {
    return this.selected.user;
  }

  public set selectedUser(v: string) {
    this.selected.user = v;
  }

  public get selectedProject(): string {
    return this.selected.project;
  }

  public set selectedProject(v: string) {
    this.selected.project = v;
  }

  public get selectedQuery(): string {
    return this.selected.query;
  }

  public set selectedQuery(v: string) {
    this.selected.query = v;
  }

  public getAllUsers(): Observable<object> {
    return this
      .http
      .get(`${this.uri}/getUsers`);
  }


  //returns a javascript
  public getAllProjects(user: string): Observable<any> {
    return this
      .http
      .get(`${this.uri}/getProjects/${user}`);
  }

  public getAllQueries(user: string, project: string): Observable<object> {
    return this
      .http
      .get(`${this.uri}/getSearches/${user}/${project}`);
  }










}
