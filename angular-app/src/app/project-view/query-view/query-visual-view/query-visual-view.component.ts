import { Component, OnInit } from '@angular/core';
import { QueryService } from 'src/app/query.service';

@Component({
  selector: 'app-query-visual-view',
  templateUrl: './query-visual-view.component.html',
  styleUrls: ['./query-visual-view.component.css']
})
export class QueryVisualViewComponent implements OnInit {

  constructor(public queryservice: QueryService) { }

  ngOnInit() {
  }

}
