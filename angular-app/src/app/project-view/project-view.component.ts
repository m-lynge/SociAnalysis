import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DirectoryService } from "../directory.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { QueryService } from '../query.service';

@Component({
    selector: 'app-project-view',
    templateUrl: './project-view.component.html',
    styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit, AfterViewInit {

    constructor(private directoryservice: DirectoryService,
                private router: Router,
                private route: ActivatedRoute,
                public queryservice: QueryService
        ) {}

    ngOnInit() {
        if (!this.directoryservice.selectedUser) {
            this.router.navigate(['/']);
        }

        if (this.route.snapshot.paramMap.get('queryName')) {
            const qname = this.route.snapshot.paramMap.get('queryName');
            // this.directoryservice.selectedQuery = qname;
        }

    }

    ngAfterViewInit(): void {


    }

}
