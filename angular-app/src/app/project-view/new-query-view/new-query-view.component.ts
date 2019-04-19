import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-new-query-view',
  templateUrl: './new-query-view.component.html',
  styleUrls: ['./new-query-view.component.css']
})
export class NewQueryViewComponent implements OnInit {

  private shownComponent = '0';

  constructor(private nagivationservice: NavigationService) { }

  ngOnInit() {
  }


  changeView(newview: string) {
    this.shownComponent = newview;
    this.nagivationservice.setNavi = true;

  }
}
