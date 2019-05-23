import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DirectoryService} from '../directory.service';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements AfterViewInit {

    hasProjects: boolean;

    constructor(private router: Router, private directoryservice: DirectoryService) {
    }

    checkIfNoProjects(event) {
        this.hasProjects = event;
        console.log(event);
    }

    ngAfterViewInit(): void {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        if (!this.directoryservice.selectedUser) {

            this.router.navigate(['/']);
        }

    }

}
