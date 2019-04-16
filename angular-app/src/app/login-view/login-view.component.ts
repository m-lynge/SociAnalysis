import { Component, OnInit } from '@angular/core';
import { FBServiceService } from '../fb-service.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {

  constructor(private fbService: FBServiceService) { }


  ngOnInit() {
  }

 loginToFacebook() {
   this.fbService.login();
 }

}
