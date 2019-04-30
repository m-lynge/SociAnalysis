import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NewProjectService } from "src/app/new-project.service";
import { FBServiceService } from 'src/app/fb-service.service';
import { Project } from '../../Project';
import { DirectoryService } from 'src/app/directory.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-new-project-overview',
  templateUrl: './new-project-overview.component.html',
  styleUrls: ['./new-project-overview.component.css']
})
export class NewProjectOverviewComponent implements OnInit {
  @Output() show: EventEmitter<number> = new EventEmitter();

  projectInfo: Project;
  constructor(
    public newprojectservice: NewProjectService,
    private fbservice: FBServiceService,
    private directoryservice: DirectoryService,
    private router: Router) { }

  ngOnInit() { }

  showNext(): void {
    this.show.emit(0);
  }

  createProject() {
    const projectInfo = new Project(
      this.newprojectservice.name,
      this.newprojectservice.descr,
      this.newprojectservice.listOfSelectedGroups);
    this.directoryservice.createProjectDirectory(this.directoryservice.selectedUser, projectInfo);
    this.router.navigate(['/projekt', this.newprojectservice.name]);

  }
}
