import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FBServiceService} from "../../fb-service.service";

@Component({
    selector: 'app-query-type-selection-view',
    templateUrl: './query-type-selection-view.component.html',
    styleUrls: ['./query-type-selection-view.component.css']
})
export class QueryTypeSelectionViewComponent implements OnInit {

    constructor(private fbService: FBServiceService) {
    }

    @Output()
    exportView: EventEmitter<string> = new EventEmitter();


    ngOnInit() {
    }

    changeView(input: string) {
        if (input === 'brugerdefineret') {



            this.exportView.emit('1');


        } else if (input === 'standard') {
            this.fbService.retrievePosts();
            this.exportView.emit('2');

        }
    }

}
