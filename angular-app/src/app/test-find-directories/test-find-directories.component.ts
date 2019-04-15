import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '../directories.service';
import { MatInput } from '@angular/material';
import { Group } from '../Group';

@Component({
  selector: 'app-test',
  templateUrl: './test-find-directories.component.html',
  styleUrls: ['./test-find-directories.component.css']
})
export class TestFindDirectoriesComponent {

  constructor(private service: DirectoriesService) { }

  // local instances of what is retrieved from 
  // node. If looking to use these,
  // use directories.service
  private allUsers: string[] = [];
  private allUsersProjects: string[] = [];
  private allUsersProjectsSearches: string[] = [];

  private projectName: string;

  // variables used in material selector *only used for debugging*
  private selectedUser = '';
  private selectedProject = '';

  // Calls findAllUsers_paths method from directoriesService,
  // to find all users on the directory
  findUserPaths() {
    this.service.retrieveAllUserPaths().subscribe((data: string[]) => {
      console.log("Printing users");
      console.log(data);
      this.service.setUsers(data);
      this.allUsers = this.service.getUsers();

    });
  }

  // Calls findAllProjects_paths method from directoriesService,
  // to find all the projects of the passed user
  findProjectPaths(user) {
    this.service.retrieveAllProjectPaths(user).subscribe((data: string[]) => {
      console.log("Printing projects from chosen user");
      console.log(data);
      this.service.setProjects(data);
      this.allUsersProjects = this.service.getProjects();
      this.selectedProject = this.allUsersProjects[0];
      this.findSearchPaths(this.selectedUser, this.selectedProject);
    })
  }

  // Calls findAllSearches_paths method from directoriesService,
  // to find all the searches of the passed project and user
  findSearchPaths(user, project) {
    this.service.retrieveAllQueryPaths(user, project).subscribe((data: string[]) => {
      console.log("Printing searches paths from chosen project");
      console.log(data);
      this.service.setSearches(data);
      this.allUsersProjectsSearches = this.service.getSearches();
    })
  }

  createNewProject(title: string) {
    if (title !== undefined) {
      if (this.selectedUser !== '') {
        console.log("Checking if title with the following title already exists: ", title)
        this.service.projectExists(this.selectedUser, title.trim().replace(/ /g, "_")).subscribe((projectExists) => {
          if (projectExists === false) {
            console.log("Project with the following title does not exists yet: ", title);
            console.log("Creating such project directory now...")
            let groupArr: Group[];
            let group = new Group("Gamer Group", "this is a definition");
            let group2 = new Group("Gamer Group", "this is a definition");
            groupArr.push(group);
            groupArr.push(group2);
            this.service.createProjectDirectory(this.selectedUser, title.trim().replace(/ /g, "_"),groupArr).subscribe((result) => {
              if (result === true) {
                console.log("Project created -> ", title, " from -> ", this.selectedUser);
              } else{
                console.log("Error", result)
              }
            });
          } else{
            console.log("Project with the following title already exists: ", title)
          }
        });

      } else {
        console.log("You have to select a user")
      }
    } else {
      console.log("You have to write a title")
    }


  }
}
