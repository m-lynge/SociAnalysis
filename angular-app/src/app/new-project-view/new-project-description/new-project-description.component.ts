import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NewProjectService } from 'src/app/new-project.service';


@Component({
  selector: 'app-new-project-description',
  templateUrl: './new-project-description.component.html',
  styleUrls: ['./new-project-description.component.css']
})

export class NewProjectDescriptionComponent implements OnInit {
  // Variables used to store the input
  title: string = '';
  description: string = '';
  @Output() show: EventEmitter<number> = new EventEmitter();

 constructor(private newService: NewProjectService) {}

  ngOnInit() {
  }


  // Combine functions later
  getTitle() {
    this.newService.setName(this.title);
    // console.log(this.title);
  }

  getDesc() {
    this.newService.setDescription(this.description);
    // console.log(this.description);
  }
  showNext(): void {
    this.show.emit(1);
  }

}

