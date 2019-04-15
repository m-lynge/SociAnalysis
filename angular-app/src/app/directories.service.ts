import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createDirective } from '@angular/compiler/src/core';
import { Group } from './Group';

@Injectable({
  providedIn: 'root'
})
export class DirectoriesService {
  uri = 'http://localhost:4000/directory';
  private usersInSystem: string[];
  private projectsFromSelectedUser: string[];
  private searchesInProjectsFromSelectedUser: string[];

  constructor(private http: HttpClient) { }

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
    // this.createGroupJSON()
    return this.createDirectory(user + '/' + project);
  }

  public createGroupJSON(user: string, project: string, allGroups: Group[]) {
    return this.createJSON(user, project, JSON.stringify(allGroups));
  }

  public createQueryJSON(user: string, project: string, query: string) {

  }

  public createJSON(user: string, project: string, jsonParsed: string) {
    return this
      .http
      .get(`${this.uri}/saveJSON/${user}/${project}/${jsonParsed}`);
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
}