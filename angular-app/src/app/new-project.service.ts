import { Injectable } from '@angular/core';
import { Group } from './Group';
import { FBServiceService } from './fb-service.service';


@Injectable({
  providedIn: 'root'
})
export class NewProjectService {
  constructor(private fbservice: FBServiceService) {}
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
    return this.listOfSelectedGroups;
  }
  public set ListOfGroups(listOfGroups: Group[]) {
    this.listOfSelectedGroups = listOfGroups;
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

  public loadProject() {
    // Get project info from directory service and set local parameters
  }

  public saveProject() {
    // Should take the project parameters and save(if new project) / overwrite (if already existing project)
  }

  public getGroupsFromAPI() {
    this.listOfAllGroups = this.fbservice.retrieveGroups();
  }

  private clearAllVariables() {
  this.name = '';
  this.descr = '';
  this.listOfSelectedGroups = [];
  this.listOfAllGroups = [];
  this.toggle = 0;
  }



}
