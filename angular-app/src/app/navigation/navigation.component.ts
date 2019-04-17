import { Component, OnInit } from '@angular/core';
import { FBServiceService } from '../fb-service.service';
import { NavigationService } from '../navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(private fbservice: FBServiceService, private navigationservice: NavigationService, private router: Router) {
  }

  ngOnInit() {
  }

  logoutOfFacebook() {
    this.fbservice.logout();
    this.navigationservice.setNavi(false);
    this.router.navigate(['']);
  }


}
