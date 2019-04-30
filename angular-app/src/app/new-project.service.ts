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
  name: string;
  descr: string;
  listOfSelectedGroups: Group[];
  listOfAllGroups: Group[];

  private newProject: boolean;
  private toggle = 0;

  nextButton: string;
  makeProjectButton: string;


  laterPushOfAllGroups: Subject<Group[]> = new Subject<Group[]>();
  laterPushOfSelectedGroups: Subject<Group[]> = new Subject<Group[]>();
  constructor(private fbservice: FBServiceService, private directoryservice: DirectoryService) {
  }
  public get Toggle(): number {
    return this.toggle;
  }
  public set Toggle(toogle: number) {
    this.toggle = toogle;
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
    this.makeProjectButton = 'Opret Projekt';
    this.Toggle = 0;
  }

  // This is called from QueryView
  public loadExistingProject(toggle: number) {
    this.clearAllVariables();
    this.nextButton = 'Opdater';
    this.makeProjectButton = '';
    this.Toggle = toggle;
    this.newProject = false;

    if (this.toggle !== 1) {
      this.directoryservice.getProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
        .then(response => {
          console.log('Getting project: ', this.directoryservice.selectedProject, 'response: ', response);
          this.name = response.name;
          this.descr = response.desc;
          this.listOfSelectedGroups = response.group;
          this.laterPushOfSelectedGroups.next(this.listOfSelectedGroups);
        });



    } else {
      console.log('running');
      this.directoryservice.getProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject)
        .then(response => {
          console.log('Getting project: ', this.directoryservice.selectedProject, 'response: ', response);
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
                  ListFromFacebook.splice(index, 1 );
                }
              });
            });

            // console.log('A', ListPreSelectedGroups, 'B', ListFromFacebook);
            // ListFromFacebook.forEach(B => {
            //   console.log('B ', B);
            //   console.log(ListPreSelectedGroups.indexOf(B));
            //   if (ListPreSelectedGroups.indexOf(B) !== -1) {
            //     SelectedGroups.push(B);
            //   } else {
            //     AvailableGroups.push(B);
            //   }
            // });

            console.log('A', SelectedGroups, 'B', ListFromFacebook);

            this.listOfSelectedGroups = SelectedGroups;
            this.listOfAllGroups = ListFromFacebook;

            this.laterPushOfSelectedGroups.next(this.listOfSelectedGroups);
            this.laterPushOfAllGroups.next(this.listOfAllGroups);
            console.log('All users groups were collected from facebook');
          });
        });
    }
  }



  public saveProject() {
    // 1: create new project dir with new name

    if (this.directoryservice.selectedProject !== this.name) {
      console.log('name has been changed');
      this.directoryservice.createDirectory(this.directoryservice.selectedUser + '/' + this.name + '/').subscribe((folderCreated) => {
        if (folderCreated) {
          console.log('folder was created: ', folderCreated);
          const temp = new Project(this.name, this.descr, this.listOfSelectedGroups);
          this.directoryservice.createProjectInfoJSON(
            this.directoryservice.selectedUser, this.name, temp
          ).done((handleData) => {
            this.directoryservice.createDirectory(
              this.directoryservice.selectedUser + '/' + this.name + '/query/').subscribe((queryfolderCreated) => {
                if (queryfolderCreated) {
                  console.log('query folder was created: ', queryfolderCreated);
                  this.directoryservice.getAllQueries(
                    this.directoryservice.selectedUser, this.directoryservice.selectedProject)
                    .subscribe((allQueries) => {
                      if (allQueries) {
                        allQueries.forEach((element: string) => {
                          console.log('copying query from old to new folder');
                          console.log('queryName: ', element);
                          // move file to new folder
                          this.directoryservice.copyQueryJSON(
                            this.directoryservice.selectedUser, this.directoryservice.selectedProject, this.name, element)
                            .done(() => {
                              console.log('copied query');
                            });
                        });
                        this.directoryservice.removeProject(
                          this.directoryservice.selectedUser, this.directoryservice.selectedProject)
                          .done(() => {
                            console.log('removed previous project');
                          });
                        this.directoryservice.selectedProject = this.name;
                      }
                    });
                }
              });

          });
          // 2: create new projectinfo.json with sleeted name, description, and groups selected
          // promiseFunction.then((bool) => {
          //   console.log('returned ', bool, ' from newproject service');
          // });
        }
      });
    }



    // 3: copy all queries from previous directory to new directory
    // 4: delete previous directory
    // Should take the project parameters and save(if new project) / overwrite (if already existing project)
    // const tempProject = new Project(this.name, this.descr, this.listOfSelectedGroups);
    // this.directoryservice.createProjectInfoJSON(this.directoryservice.selectedUser, this.directoryservice.selectedProject, tempProject);
  }

  public getGroupsFromAPI() {
    console.log('attempting to get groups');
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
