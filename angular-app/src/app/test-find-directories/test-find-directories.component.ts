import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '../DEPRECATEDdirectories.service';
import { MatInput } from '@angular/material';
import { Group } from '../Group';
import { DirectoryService } from '../directory.service';
import { ProjectComponent } from '../home-view/project-list/project/project.component';


interface ProjectInterface {
  name: string;
  desc: string;
  group: Group[];
}

@Component({
  selector: 'app-test',
  templateUrl: './test-find-directories.component.html',
  styleUrls: ['./test-find-directories.component.css']
})



export class TestFindDirectoriesComponent {



  constructor(private service: DirectoryService) { }

  // local instances of what is retrieved from 
  // node. If looking to use these,
  // use directories.service
  private allUsers: string[] = [];
  private allUsersProjects: ProjectInterface[] = [];
  private allUsersProjectsSearches: string[] = [];

  private projectName: string;
  private projectDesc: string;

  // variables used in material selector *only used for debugging*
  private selectedUser = '';
  private selectedProject = '';

  // Calls findAllUsers_paths method from directoriesService,
  // to find all users on the directory
  findUserPaths() {
    this.service.getAllUsers().subscribe((data: string[]) => {
      console.log("Printing users");
      console.log(data);
      this.allUsers = data;
    });
  }

  // Calls findAllProjects_paths method from directoriesService,
  // to find all the projects of the passed user
  findProjectPaths() {
    this.allUsersProjects = [];
    this.allUsersProjectsSearches = [];
    this.service.getAllProjects(this.service.selectedUser).subscribe((data: ProjectInterface[]) => {
      console.log("Printing projects from chosen user");
      console.log(data);
      this.allUsersProjects = data;
      this.service.selectedProject = data[0].name;
    })

  }

  // Calls findAllSearches_paths method from directoriesService,
  // to find all the searches of the passed project and user
  findSearchPaths() {
    let temproject: ProjectInterface = { name: this.service.selectedProject.trim().replace(/ /g, "_"), desc: null, group: null };
    this.service.getAllQueries(this.service.selectedUser, temproject).subscribe((data: string[]) => {
      console.log("Printing searches paths from chosen project");
      console.log(data);
      this.allUsersProjectsSearches = data;
    })
  }

  createNewProject(title: string, description: string) {
    if (title !== undefined && description !== undefined) {
      if (this.service.selectedUser !== '') {
        console.log("Checking if title with the following title already exists: ", title)

        //DUMMY DATA
        var groupArr: Group[] = [];
        let group = new Group("Gamer Group", "this is a definition");
        let group2 = new Group("Gamer Group2", "this is a also definition");
        let att = { groups: [group, group2] }
        groupArr.push(group);
        groupArr.push(group2);

        let trimmedName = title.trim().replace(/ /g, "_");
        let projectTitleExport: ProjectInterface = { name: trimmedName, desc: description, group: groupArr };
        this.service.projectExists(this.service.selectedUser, projectTitleExport).subscribe((projectExists) => {
          if (projectExists === false) {
            console.log("Project with the following title does not exists yet: ", projectTitleExport.name);
            console.log("Creating such project directory now...")
            this.service.createProjectDirectory(this.selectedUser, projectTitleExport);
          } else {
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
