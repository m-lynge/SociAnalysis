import {Injectable} from '@angular/core';
import {Selected} from './Selected';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from './Project';
import {Query} from './Query';


@Injectable({
    providedIn: 'root'
})

export class DirectoryService {

    private uri = '//localhost:4000/directory';
    private selected: Selected;

    constructor(private http: HttpClient) {
        this.selected = new Selected(null, null, null);
    }

    // Getters and setters for selecting user
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


    // returns a javascript array
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

    public getQuery(user: string, project: string, query: string): Observable<any> {
        return this
            .http
            .get(`${this.uri}/getProject/${user}/${project}/${query}`);
    }

    public userExists(user: string) {
        return this.directoryExists(user);
    }

    public projectExists(user: string, project: Project) {
        const path = user + '/' + project.name;
        console.log('CHECK: ', path);
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
                        this.createProjectInfoJSON(user, project.name, project).subscribe((resp) => {
                            if (resp) {
                                console.log('JSON file created');
                            }
                        });
                    }
                });
            }
        });
    }

    public createUserDirectory(user: string) {
        return this.createDirectory(user);
    }

    private createDirectory(path: string) {
        return this
            .http
            .get(`${this.uri}/makeDir/${path}`);
    }

    public createProjectInfoJSON(user: string, project: string, projectInfoObject: Project) {
        return this
            .http
            .get(`${this.uri}/saveJSON/${user}/${project}/${JSON.stringify(projectInfoObject)}`);
    }

    public createQueryJSON(user: string, project: string, query: Query) {

        console.log(query);

        $.ajax({
            url: this.uri + '/saveJSON',
            type: 'POST',
            data: {user, project, query},

            success: response => {
                console.log(response);
            }
        });


    }
}
