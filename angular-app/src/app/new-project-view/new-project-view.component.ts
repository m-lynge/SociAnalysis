import {Router} from '@angular/router';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FBServiceService} from '../fb-service.service';
import {DirectoryService} from '../directory.service';
import {NewProjectService} from '../new-project.service';


@Component({
    selector: 'app-new-project-view',
    templateUrl: './new-project-view.component.html'
})
export class NewProjectViewComponent implements AfterViewInit {
    constructor(
        private fbService: FBServiceService,
        public newprojectservice: NewProjectService,
        private router: Router,
        private directoryservice: DirectoryService
    ) {
    }

    ngAfterViewInit(): void {
        if (!this.directoryservice.selectedUser) {
            this.router.navigate(['/']);
        }

    }


}
