import {Component} from '@angular/core';
import {FBServiceService} from './fb-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'socianalysis';

    constructor(private fbService: FBServiceService) {
       // fbService.fbInit();
    }

    funfunc(){
        this.fbService.fbInit();
    }

}
