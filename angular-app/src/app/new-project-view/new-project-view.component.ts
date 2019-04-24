import {Component, OnInit} from '@angular/core';
import {FBServiceService} from "../fb-service.service";

@Component({
    selector: 'app-new-project-view',
    templateUrl: './new-project-view.component.html',
    styleUrls: ['./new-project-view.component.css']
})
export class NewProjectViewComponent implements OnInit {
    toggle: number;

    constructor(private fbService: FBServiceService) {
        this.toggle = 0;
    }

    setToggle(num: number) {
        this.toggle = num;


    }

    ngOnInit() {
        this.fbService.FetchGroups('/' + this.fbService.userID + '/groups?fields=administrator,name,description');
    }


}
