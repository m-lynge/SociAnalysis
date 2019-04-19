import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-project-view',
  templateUrl: './new-project-view.component.html',
  styleUrls: ['./new-project-view.component.css']
})
export class NewProjectViewComponent implements OnInit {
  toggle: number;
 
  constructor() {this.toggle = 0; }

  setToggle(num: number){
    this.toggle = num;

    
  }
  ngOnInit() {
  }


}