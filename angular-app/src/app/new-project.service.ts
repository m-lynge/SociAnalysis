import { Injectable } from '@angular/core';
import { Group } from './Group';
import { FBServiceService } from './fb-service.service';
import { Project } from './Project';
import { DirectoryService } from './directory.service';
import { BehaviorSubject, observable, Subject } from 'rxjs';
import { query } from '@angular/animations';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class NewProjectService {
  name: string;
  descr: string;
  listOfSelectedGroups: Group[];
  listOfAllGroups: Group[];

  private newProject: boolean;
  private toggle = 0;
  private viewingNewproject: boolean;

  // Text for buttons and header in new project view
  headerProjectName: string;
  nextButton: string;
  makeProjectButton: string;


  laterPushOfAllGroups: Subject<Group[]> = new Subject<Group[]>();
  laterPushOfSelectedGroups: Subject<Group[]> = new Subject<Group[]>();
  constructor(private fbservice: FBServiceService,
    private directoryservice: DirectoryService,
    private navigationservice: NavigationService,
    private router: Router) {
  }
  public get Toggle(): number {
    return this.toggle;
  }
  public set Toggle(toogle: number) {
    this.toggle = toogle;
  }

  public get ViewingNewProject(): boolean {
    return this.viewingNewproject;
  }
  public set ViewingNewProject(bool: boolean) {
    this.viewingNewproject = bool;
  }

  public get NewProject(): boolean {
    return this.newProject;
  }
  // This is called from the home-view
  public loadNewProject() {
    this.newProject = true;
    this.clearAllVariables();
    this.getGroupsFromAPI();
    this.nextButton = 'Videre';
    this.makeProjectButton = 'Gem Projekt';
    this.headerProjectName = 'Beskriv dit projekt';
    this.Toggle = 0;
  }

  // This is called from QueryView
  public loadExistingProject(toggle: number) {
    this.clearAllVariables();
    this.nextButton = 'Gem';
    this.makeProjectButton = 'Gå tilbage';
    this.headerProjectName = 'Ændre dit projekt';
    this.Toggle = toggle;
    this.newProject = false;

    if (this.toggle !== 1) {
      this.directoryservice.getProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
        .then(response => {
          this.name = response.name;
          this.descr = response.desc;
          this.listOfSelectedGroups = response.group;
          this.laterPushOfSelectedGroups.next(this.listOfSelectedGroups);
        });



    } else {
      this.directoryservice.getProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
        .then(response => {
          const ListPreSelectedGroups = response.group;
          this.name = response.name;
          this.descr = response.desc;

          this.fbservice.getGroups(
            '/' + this.directoryservice.selectedUser + '/groups?fields=administrator,name,description'
          ).then((groups) => {
            const ListFromFacebook = groups.filter((singleGroup) => {
              return singleGroup.administrator;
            }).map((filteredGroup) => {
              return new Group(filteredGroup.name, filteredGroup.description, filteredGroup.id);

            });
            const SelectedGroups = [];
            ListFromFacebook.forEach((A, index) => {
              ListPreSelectedGroups.forEach((B) => {
                if (A.id === B.id) {
                  SelectedGroups.push(B);
                }
              });
            });

            ListPreSelectedGroups.forEach((A) => {
              ListFromFacebook.forEach((B, index) => {
                if (A.id === B.id) {
                  ListFromFacebook.splice(index, 1);
                }
              });
            });

            this.listOfSelectedGroups = SelectedGroups;
            this.listOfAllGroups = ListFromFacebook;
            this.laterPushOfSelectedGroups.next(this.listOfSelectedGroups);
            this.laterPushOfAllGroups.next(this.listOfAllGroups);
          });
        });
    }
  }



  public async copyProject() {
    if (this.directoryservice.selectedProject !== this.name) {
      this.directoryservice.createDirectory(this.directoryservice.selectedUser + '/' + this.name + '/').subscribe((folderCreated) => {
        if (folderCreated) {
          const temp = new Project(this.name, this.descr, this.listOfSelectedGroups);
          this.directoryservice.createProjectInfoJSON(
            this.directoryservice.selectedUser, this.name, temp
          ).done((handleData) => {
            this.directoryservice.createDirectory(
              this.directoryservice.selectedUser + '/' + this.name + '/query/').subscribe((queryfolderCreated) => {
                if (queryfolderCreated) {
                  this.directoryservice.getAllQueries(
                    this.directoryservice.selectedUser, this.directoryservice.selectedProject)
                    .subscribe(async (allQueries) => {
                      if (allQueries) {
                        const promises = allQueries.map(async query => {
                          return this.directoryservice.copyQueryJSON(
                            this.directoryservice.selectedUser, this.directoryservice.selectedProject, this.name, query);
                        });

                        return await Promise.all(promises).then(() => {
                          this.directoryservice.removeProject(
                            this.directoryservice.selectedUser, this.directoryservice.selectedProject)
                            .done(() => {
                              this.directoryservice.selectedProject = this.name;
                              this.navigationservice.GoBackRoute = ['/home'];
                              this.ViewingNewProject = false;
                              this.router.navigate(['/projekt', '']);
                            });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    }
  }

  public saveProject() {
    this.directoryservice.getProjectInfoJSON(
      this.directoryservice.selectedUser, this.directoryservice.selectedProject)
      .then((project: Project) => {
        const projectInstance = new Project(project.name, project.desc, this.listOfSelectedGroups);
        this.directoryservice.createProjectInfoJSON(
          this.directoryservice.selectedUser, project.name, projectInstance
        ).done((handleData) => {
          this.navigationservice.GoBackRoute = ['/home'];
          this.ViewingNewProject = false;
          this.router.navigate(['/projekt', '']);
        });
      });
  }

  public getGroupsFromAPI() {
    this.fbservice.getGroups(
      '/' + this.directoryservice.selectedUser + '/groups?fields=administrator,name,description'
    ).then((groups) => {
      this.listOfAllGroups = groups.filter((singleGroup) => {
        return singleGroup.administrator;
      }).map((filteredGroup) => {
        return new Group(filteredGroup.name, filteredGroup.description, filteredGroup.id);
      });
      this.laterPushOfAllGroups.next(this.listOfAllGroups);
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
