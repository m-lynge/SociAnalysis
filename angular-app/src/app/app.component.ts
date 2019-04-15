import {Component, OnInit} from '@angular/core';
import {FBServiceService} from './fb-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {


    constructor(private fbService: FBServiceService) {
    }

    // Dette er login tingen!
    funfunc() {
        this.fbService.login();
    }

}
