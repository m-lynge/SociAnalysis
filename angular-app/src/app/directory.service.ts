import { Injectable } from '@angular/core';
import { Selected } from './Selected';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './Group';


interface ProjectInterface {
  name: string;
  desc: string;
  group: Group[];
}

@Injectable({
  providedIn: 'root'
})

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

  public getAllQueries(user: string, project: ProjectInterface): Observable<object> {
    return this
      .http
      .get(`${this.uri}/getQueries/${user}/${project.name}`);
  }

  public userExists(user: string) {
    return this.directoryExists(user);
  }

  public projectExists(user: string, project: ProjectInterface) {
    const path = user + '/' + project;
    return this.directoryExists(path);
  }

  private directoryExists(path: string) {
    return this
      .http
      .get(`${this.uri}/dirExists/${path}`);
  }

  public createProjectDirectory(user: string, project: ProjectInterface, allGroups: Group[]) {
    // firstly, this method creates a directory for the project
    return this.createDirectory(user + '/' + project).subscribe((directoryCreated) => {
      if (directoryCreated) {
        // if the directory was created, it then creates a folder for the queries and saves
        // the specified groups into a separete json file under the project folder
        this.createDirectory(user + '/' + project + '/' + 'query').subscribe((res) => {
          if (res) {
            // then if both were succesfull, createGroupJSON is called using passed json-element "allGroups"
            this.createGroupJSON(user, project, allGroups).subscribe((resp) => {
              if (resp) {
                console.log('JSON file created');
              }
            });
          }
        });
      }
    });
  }

  private createDirectory(path: string) {
    return this
      .http
      .get(`${this.uri}/makeDir/${path}`);
  }

  public createGroupJSON(user: string, project: ProjectInterface, allGroups: Group[]) {
    return this.createJSON(user, project, { title: 'group', jsonString: JSON.stringify(allGroups) });
  }

  public createQueryJSON(user: string, project: ProjectInterface, query: object) {
    return this.createJSON(user, project, { title: 'query', jsonString: JSON.stringify(query) });
  }

  private createJSON(user: string, project: ProjectInterface, jsonObject: any) {
    if (jsonObject.hasOwnProperty('title') && jsonObject.title === 'group') {
      return this
        .http
        .get(`${this.uri}/saveJSON/${user}/${project.name}/${jsonObject.jsonString}`);
    }
    return this
      .http
      .get(`${this.uri}/saveJSON/${user}/${project.name}/${jsonObject.title}/${jsonObject.jsonString}`);
  }







}
