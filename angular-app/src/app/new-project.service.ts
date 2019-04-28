import { Injectable } from '@angular/core';
import { Group } from './Group';
import { FBServiceService } from './fb-service.service';
import { Project } from './Project';
import { DirectoryService } from './directory.service';
import { BehaviorSubject, observable, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class NewProjectService {
  private name: string;
  private descr: string;
  private listOfSelectedGroups: Group[];
  public listOfAllGroups: Group[];
  private toggle = 0;
  private nextButton: string;
  private makeProjectButton: string;
  private newProject: boolean;
  laterPushOfAllGroups: Subject<Group[]> = new Subject<Group[]>();
  laterPushOfSelectedGroups: Subject<Group[]> = new Subject<Group[]>();
  constructor(private fbservice: FBServiceService, private directoryservice: DirectoryService) {
   }

  public get Name(): string {
    return this.name;
  }
  public set Name(name: string) {
    this.name = name;
  }
  public get Description(): string {
    return this.descr;
  }
  public set Description(descr: string) {
    this.descr = descr;
  }
  public get ListOfGroups(): Group[] {
    return this.listOfAllGroups;
  }
  public set ListOfSelectedGroups(listOfGroups: Group[]) {
    this.listOfSelectedGroups = listOfGroups;
  }
  public get ListOfSelectedGroups(): Group[] {
    return this.listOfSelectedGroups;
  }
  public get Toggle(): number {
    return this.toggle;
  }
  public set Toggle(toogle: number) {
    this.toggle = toogle;
  }
  public get NextButton(): string {
    return this.nextButton;
  }
  public get MakeProjectButton(): string {
    return this.nextButton;
  }
  public get NewProject(): boolean {
    return this.newProject;
  }
  // This is called from the home-view
  public loadNewProject() {
    this.clearAllVariables();
    this.getGroupsFromAPI();
    this.nextButton = 'Videre';
    this.makeProjectButton = 'Opret Projekt';
    this.Toggle = 0;
    this.newProject = true;
  }

  // This is called from QueryView
  public loadExistingProject(toggle: number) {
    this.clearAllVariables();
    // No need for making API call for the first edit page
    if (toggle !== 0) {
    this.getGroupsFromAPI();
    }
    this.directoryservice.getProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
      .then(response => {
        this.Name = response.name;
        this.Description = response.desc;
        this.ListOfSelectedGroups = response.group;
        this.laterPushOfSelectedGroups.next(this.listOfSelectedGroups);
        if (toggle === 1){
        }
      });
    this.nextButton = 'Opdater';
    this.makeProjectButton = this.nextButton;
    this.Toggle = toggle;
    this.newProject = false;
  }

  public saveProject() {
    // Should take the project parameters and save(if new project) / overwrite (if already existing project)
    const tempProject = new Project(this.Name, this.Description, this.ListOfSelectedGroups);
    this.directoryservice.createProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject, tempProject);
  }

  public getGroupsFromAPI() {
    console.log('attempting to get groups');
    console.log('selected user for api call: ', this.directoryservice.selectedUser);
    this.fbservice.getGroups(
      '/' + this.directoryservice.selectedUser + '/groups?fields=administrator,name,description'
    ).then((groups) => {
      this.listOfAllGroups = groups.filter((singleGroup) => {
        return singleGroup.administrator;
      }).map((filteredGroup) => {
        return new Group(filteredGroup.name, filteredGroup.description, filteredGroup.id);
      });
      this.laterPushOfAllGroups.next(this.listOfAllGroups);
      console.log('All users groups were collected from facebook');
    });
  }

  private clearAllVariables() {
    this.name = '';
    this.descr = '';
    this.listOfSelectedGroups = [];
    this.listOfAllGroups = [];
    this.toggle = 0;
  }



}
