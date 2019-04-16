import { Component, OnInit } from "@angular/core";
import { FBServiceService } from "../fb-service.service";
import { Router } from "@angular/router";
import { NavigationService } from "../navigation.service";
@Component({
  selector: "app-login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.css"]
})
export class LoginViewComponent implements OnInit {
  returnValue: boolean;
  loading: boolean;
  failed: boolean;
  showButton: boolean;

  constructor(
    private fbService: FBServiceService,
    private router: Router,
    private navigationservice: NavigationService
  ) {
    this.loading = false;
    this.failed = false;
    this.showButton = true;
  }

  ngOnInit() {}

  loginToFacebook() {
    this.loading = true;
    this.showButton = false;
    this.failed = false;
    this.fbService
      .login()
      .then(id => {
        this.navigationservice.setNavi(true);
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.log('Error: not logged in');
        this.showButton = true;
        this.loading = false;
        this.failed = true;
      });
  }
}
