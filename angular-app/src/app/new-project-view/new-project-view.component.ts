import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FBServiceService } from "../fb-service.service";
import { DirectoryService } from '../directory.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-project-view',
    templateUrl: './new-project-view.component.html',
    styleUrls: ['./new-project-view.component.css']
})
export class NewProjectViewComponent implements OnInit, AfterViewInit {
    toggle: number;

    constructor(private fbService: FBServiceService, private directoryservice: DirectoryService, private router: Router) {
        this.toggle = 0;
    }

    setToggle(num: number) {
        this.toggle = num;


    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        if (!this.directoryservice.selectedUser) {
            this.router.navigate(['/']);
        } else {
            this.fbService.FetchGroups('/' + this.fbService.userID + '/groups?fields=administrator,name,description');
        }


    }


}
