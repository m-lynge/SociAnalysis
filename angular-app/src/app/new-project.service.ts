import { Injectable } from '@angular/core';
import { Group } from './Group';
import { FBServiceService } from './fb-service.service';
import { Project } from './Project';
import { DirectoryService } from './directory.service';


@Injectable({
  providedIn: 'root'
})
export class NewProjectService {
  constructor(private fbservice: FBServiceService, private directoryservice: DirectoryService) { }
  private name: string;
  private descr: string;
  private listOfSelectedGroups: Group[];
  private listOfAllGroups: Group[];
  private toggle = 0;
  private nextButton: string;
  private makeProjectButton: string;
  private newProject: boolean;

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
  public set ListOfGroups(listOfGroups: Group[]) {
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
    this.loadProject();
    this.getGroupsFromAPI();
    this.nextButton = 'Opdater projekt';
    this.makeProjectButton = this.nextButton;
    this.Toggle = toggle;
    this.newProject = false;
  }

  public saveProject() {
    // Should take the project parameters and save(if new project) / overwrite (if already existing project)
    const tempProject = new Project(this.Name, this.Description, this.ListOfSelectedGroups);
    // ++++++++add code here to save the project into a JSON file with directory service 
  }

  public loadProject() {
    // Get project info from directory service and set local parameters
    // ++++++++add code here to return current project JSON file from directory service
    const currentProject = new Project('test', 'test', []);
    this.Name = currentProject.name;
    this.Description = currentProject.desc;
    this.ListOfGroups = currentProject.group;
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
