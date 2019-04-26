import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DirectoryService} from "../directory.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-project-view',
    templateUrl: './project-view.component.html',
    styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit, AfterViewInit {

    constructor(private directoryservice: DirectoryService, private router: Router) {
    }

    ngOnInit() {
        if (!this.directoryservice.selectedUser) {
            this.router.navigate(['/']);
        }
    }

    ngAfterViewInit(): void {


    }

}
