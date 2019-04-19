import { Component, OnInit } from '@angular/core';
import { FBServiceService } from '../fb-service.service';
import { NavigationService } from '../navigation.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(private fbservice: FBServiceService,
              private navigationservice: NavigationService,
              private router: Router,
              private location: Location
    ) {}
  ngOnInit() {}

  goBack() {
    this.location.back();
    console.log(this.location.path);
  }

  logoutOfFacebook() {
    this.fbservice.logout();
    this.navigationservice.setNavi(false);
    this.router.navigate(['']);
  }


}
