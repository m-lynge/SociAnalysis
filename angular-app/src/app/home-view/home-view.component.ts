import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryService } from '../directory.service';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit, AfterViewInit {

    constructor(private router: Router, private directoryservice: DirectoryService) {
    }

    ngOnInit() {
    }

    changeToLoginView() {
        this.router.navigate(['/projekt']);
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        if (!this.directoryservice.selectedUser) {
            this.router.navigate(['/']);
        }

    }

}
