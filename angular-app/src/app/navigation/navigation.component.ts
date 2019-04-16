import { Component, OnInit } from '@angular/core';
import { FBServiceService } from '../fb-service.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  returnValue: boolean;
  constructor(private fbservice: FBServiceService) { }

  ngOnInit() {}

  logoutOfFacebook() {
    this.fbservice.logout();
  }


}
