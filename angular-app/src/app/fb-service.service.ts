import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FBServiceService {

    constructor() {
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: '582581992245168',
                cookie: true,
                xfbml: true,
                version: 'v3.1'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    fbInit() {



        console.log("submit login to facebook");
        // FB.login();
        FB.login((response) => {
            console.log('submitLogin', response);
            if (response.authResponse) {
                console.log(response.authResponse);

            } else {
                console.log('User login failed');
            }
        }, {auth_type: 'reauthenticate'});
    }
}

