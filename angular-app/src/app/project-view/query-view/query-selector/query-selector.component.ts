import { Component, OnInit } from '@angular/core';
import { DirectoryService } from 'src/app/directory.service';

@Component({
  selector: 'app-query-selector',
  templateUrl: './query-selector.component.html',
  styleUrls: ['./query-selector.component.css']
})
export class QuerySelectorComponent implements OnInit {

  constructor(private directoryservice: DirectoryService ) {}

  ngOnInit() {
  }

}
