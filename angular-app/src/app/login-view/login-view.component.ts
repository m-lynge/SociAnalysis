import { Component, OnInit } from '@angular/core';
import { FBServiceService } from '../fb-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})


export class LoginViewComponent implements OnInit {
  returnValue: boolean;
  constructor(private fbService: FBServiceService, private router: Router) {}

  ngOnInit() {}

  loginToFacebook() {
   // this.returnValue = this.fbService.login();
    this.router.navigate(['/loading']);
    if (this.returnValue) {
      console.log('Loggedin');
    } else {
      console.log('returning to early');
    }
  }
}
