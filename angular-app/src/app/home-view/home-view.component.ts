import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    changeToLoginView() {
        this.router.navigate(['/projekt']);
    }

}
