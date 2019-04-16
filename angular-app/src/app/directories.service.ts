import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createDirective } from '@angular/compiler/src/core';
import { Group } from './Group';
import { all } from 'q';
import { Selected } from './Selected';

@Injectable({
  providedIn: 'root'
})
export class DirectoriesService {
  uri = 'http://localhost:4000/directory';
  private usersInSystem: string[];
  private projectsFromSelectedUser: string[];
  private searchesInProjectsFromSelectedUser: string[];

  private selected: Selected

  constructor(private http: HttpClient, ) {
    this.selected = new Selected(null, null, null);
  }

  /**
* Checks if user provided exists
* @param path - the user in question
* @returns true: user exists, false: user does not exists
*/
  public userExists(user: string) {
    return this.directoryExists(user);
  }

  public projectExists(user: string, project: string) {
    const path = user + '/' + project;
    return this.directoryExists(path);
  }

  private directoryExists(path: string) {
    return this
      .http
      .get(`${this.uri}/dirExists/${path}`);
  }

  public createUserDirectory(user: string) {
    return this.createDirectory(user);
  }

  public createProjectDirectory(user: string, project: string, allGroups: Group[]) {
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

  public createGroupJSON(user: string, project: string, allGroups: Group[]) {
    return this.createJSON(user, project, { title: 'group', jsonString: JSON.stringify(allGroups) });
  }

  public createQueryJSON(user: string, project: string, query: object) {
    return this.createJSON(user, project, { title: 'query', jsonString: JSON.stringify(query) });
  }


  /**
* Creates a json file at the path provided
* @param user - for which user to save the json file under
* @param project - for which project to save the json file under
* @param jsonObject - Object of the following structure: {title: , jsonString: }
* @returns true if directory was succesfully created, else an error is thrown
*/
  private createJSON(user: string, project: string, jsonObject: any) {
    if (jsonObject.hasOwnProperty('title') && jsonObject.title === 'group') {
      return this
        .http
        .get(`${this.uri}/saveJSON/${user}/${project}/${jsonObject.jsonString}`);
    }
    return this
      .http
      .get(`${this.uri}/saveJSON/${user}/${project}/${jsonObject.title}/${jsonObject.jsonString}`);
  }

  /**
* Creates a directory at the path provided
* @param path - the destination of the folder created
* @returns true if directory was succesfully created, else an error is thrown
*/
  private createDirectory(path: string) {
    return this
      .http
      .get(`${this.uri}/makeDir/${path}`);
  }

  /**
 * Returns an array containing all folder names,
 * each element signifying a user
 * @returns A string[]
 */
  public retrieveAllUserPaths() {
    return this
      .http
      .get(`${this.uri}/getUsers`);
  }

  /**
 * Returns an array containing all folder names,
 * each element signifying a project
 * @param user - From which user should the function return projects of?
 * @returns A string[]
 */
  public retrieveAllProjectPaths(user: string) {
    return this
      .http
      .get(`${this.uri}/getProjects/${user}`);
  }

  /**
 * Returns an array containing all file names,
 * each element signifying a search
 * @param user - From which user should the function return projects of?
 * @param project - From which project should the function return searches of?
 * @returns A string[]
 */
  public retrieveAllQueryPaths(user: string, project: string) {
    return this
      .http
      .get(`${this.uri}/getSearches/${user}/${project}`);
  }





  /**
 * Setter method to set private variable usersInSystem: string[]
 * @param input - The users in the system
 */
  public setUsers(input: string[]) {
    this.usersInSystem = input;
  }

  /**
 * Getter method to retrieve private variable usersInSystem: string[] 
 * @returns The users in the system
 */
  public getUsers() {
    return this.usersInSystem;
  }

  /**
 * Setter method to set private variable projectsFromSelectedUser: string[]
 * @param input - The projects in the system
 */
  public setProjects(input: string[]) {
    this.projectsFromSelectedUser = input;
  }

  /**
* Getter method to retrieve private variable projectsFromSelectedUser: string[] 
* @returns The projects in the system
*/
  public getProjects() {
    return this.projectsFromSelectedUser;
  }

  /**
 * Setter method to set private variable searchesInProjectsFromSelectedUser: string[]
 * @param input - The searches in the system
 */
  public setSearches(input: string[]) {
    this.searchesInProjectsFromSelectedUser = input;
  }

  /**
* Getter method to retrieve private variable searchesInProjectsFromSelectedUser: string[] 
* @returns The searches in the system
*/
  public getSearches() {
    return this.searchesInProjectsFromSelectedUser;
  }

  public setSelectedUser(user: string) {
    this.selected.user = user;
  }

  public setSelectedProject(project: string) {
    this.selected.project = project;
  }

  public setSelectedQuery(query: string) {
    this.selected.query = query;
  }

  public getSelected() {
    return this.selected;
  }
}