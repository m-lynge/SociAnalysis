import {Component} from '@angular/core';
import {FBServiceService} from './fb-service.service';
import { NavigationService } from './navigation.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {


    constructor(private fbService: FBServiceService, public navigationservice: NavigationService) {
        this.navigationservice.setNavi = true;
    }

}
