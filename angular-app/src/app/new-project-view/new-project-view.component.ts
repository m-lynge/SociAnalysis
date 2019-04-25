import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FBServiceService } from "../fb-service.service";
import { DirectoryService } from '../directory.service';
import { NewProjectService } from '../new-project.service';


@Component({
    selector: 'app-new-project-view',
    templateUrl: './new-project-view.component.html',
    styleUrls: ['./new-project-view.component.css']
})
export class NewProjectViewComponent implements OnInit, AfterViewInit {
    constructor(
        private fbService: FBServiceService,
        public newprojectservice: NewProjectService,
        private router: Router,
        private directoryservice: DirectoryService
        ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        if (!this.directoryservice.selectedUser) {
            this.router.navigate(['/']);
        } else {
            // this.fbService.FetchGroups('/' + this.fbService.userID + '/groups?fields=administrator,name,description');
        }


    }


}
