import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  constructor(private router: Router) { }

  createNewProject(){
    this.router.navigate(['opretprojekt']);
  }
  ngOnInit() {
  }

}
