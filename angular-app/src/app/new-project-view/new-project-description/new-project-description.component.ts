import { Component, OnInit, NgModule } from '@angular/core';
import { NewProjectService } from 'src/app/new-project.service';



@Component({
  selector: 'app-new-project-description',
  templateUrl: './new-project-description.component.html',
  styleUrls: ['./new-project-description.component.css']
})

export class NewProjectDescriptionComponent implements OnInit {
//Variables used to store the input
title: string ='';
description: string ='';
projectGroupToggle: boolean =true;

  constructor(private newService: NewProjectService) { }

  ngOnInit() {
  }

getTitle(){
  this.newService.setName(this.title);
  //console.log(this.title);
}

getDesc(){
  this.newService.setDescription(this.description);
  //console.log(this.description);
}
makefalse(){
  this.projectGroupToggle = !this.projectGroupToggle;
}

}
