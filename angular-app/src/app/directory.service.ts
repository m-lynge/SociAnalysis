import { Injectable } from '@angular/core';
import { Selected } from './Selected';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './Project';
import { Query } from './Query';
import { JsonPipe } from '@angular/common';


@Injectable({
    providedIn: 'root'
})

export class DirectoryService {
    private uri = '//localhost:4000/directory';
    private selected: Selected;

    constructor(private http: HttpClient) {
        this.selected = new Selected(null, null, null);
    }

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

    public getAllProjects(user: string): Observable<any> {
        return this
            .http
            .get(`${this.uri}/getProjects/${user}`);
    }

    public getAllQueries(user: string, project: string): Observable<any> {
        return this
            .http
            .get(`${this.uri}/getQueries/${user}/${project}`);
    }

    public getProject(user: string, project: string): Observable<any> {
        return this
            .http
            .get(`${this.uri}/getProject/${user}/${project}`);
    }

    public userExists(user: string) {
        return this.directoryExists(user);
    }

    public projectExists(user: string, project: string) {
        const path = user + '/' + project;
        return this.directoryExists(path);
    }

    public queryExists(user: string, project: string, query: string) {
        const path = user + '/' + project + '/' + query;
        return this.directoryExists(path);
    }

    private directoryExists(path: string) {
        return this
            .http
            .get(`${this.uri}/dirExists/${path}`);
    }

    public createProjectDirectory(user: string, project: Project) {
        // firstly, this method creates a directory for the project
        return this.createDirectory(user + '/' + project.name).subscribe((directoryCreated) => {
            if (directoryCreated) {
                // if the directory was created, it then creates a folder for the queries and saves
                // the specified groups and project info into a separate json file within the project folder
                this.createDirectory(user + '/' + project.name + '/' + 'query').subscribe((res) => {
                    if (res) {
                        // then if both were succesfull, createGroupJSON is called using passed json-element 'allGroups'
                        this.createProjectInfoJSON(user, project.name, project);
                    }
                });
            }
        });
    }

    public createUserDirectory(user: string) {
        return this.createDirectory(user);
    }

    public createDirectory(path: string) {
        return this
            .http
            .get(`${this.uri}/makeDir/${path}`);
    }

    public createProjectInfoJSON(user: string, project: string, projectInfoObject: Project) {
        return $.ajax({
            url: this.uri + '/saveProjectJSON',
            type: 'POST',
            data: { user, project, projectInfoObject },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            },
        });

    }

    public createQueryJSON(user: string, project: string, query: Query) {
        $.ajax({
            url: this.uri + '/saveQueryJSON',
            type: 'POST',
            data: { user, project, query },
        });
    }

    async wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getProjectInfoJSON(user: string, projectName: string) {
        let returnValue: Project;
        $.ajax({
            url: this.uri + '/getProjectJson',
            type: 'POST',
            data: { user, projectName },
            success: response => {
                const newResponse = JSON.parse(response);
                returnValue = new Project(newResponse.name, newResponse.desc, newResponse.group);
            }
        });
        while (!returnValue) {
            await this.wait(100);
        }
        return returnValue;
    }

    async getQuery(user: string, projectName: string, query: string) {
        let returnValue;
        $.ajax({
            url: this.uri + '/getQueryJson',
            type: 'POST',
            data: { user, projectName, query },
            success: response => {
                returnValue = JSON.parse(response);
            }
        });
        while (!returnValue) {
            await this.wait(100);
        }
        return returnValue;
    }

    public copyQueryJSON(user: string, oldProjectName: string, newProjectName: string, queryName: string) {
        return $.ajax({
            url: this.uri + '/copyFile',
            type: 'POST',
            data: { user, oldProjectName, newProjectName, queryName },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            },
        });
    }

    public removeProject(user: string, projectName: string) {
        return $.ajax({
            url: this.uri + '/removeProject',
            type: 'POST',
            data: { user, projectName },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            },
        });
    }

    public removeQuerry(user: string, projectName: string, queryName: string) {
        return $.ajax({
            url: this.uri + '/removeQuery',
            type: 'POST',
            data: { user, projectName, queryName },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            },
        });
    }
}
