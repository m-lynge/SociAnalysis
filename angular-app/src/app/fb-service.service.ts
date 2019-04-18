import { Injectable, NgZone } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FBServiceService {

    userID = '';
    isFirst = true;
    listOfGrpups = [];

    constructor(private zone: NgZone) {
        (window as any).fbAsyncInit = () => {
            FB.init({
                appId: '582581992245168',
                cookie: true,
                xfbml: true,
                version: 'v3.1'
            });
            FB.AppEvents.logPageView();
        };

        (((d, s, id) => {
            let js;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk'));
    }

    login() {
        return new Promise((resolve, reject) => {
            console.log('submit login to facebook');
            FB.login((response) => {
                console.log('submitLogin', response);
                if (response.authResponse) {
                    // console.log(response.authResponse);
                    this.userID = response.authResponse.userID;
                    this.recursiveFunction('');
                    resolve(response.authResponse);
                } else {
                    reject('Login Failed');
                }
            }, { auth_type: 'reauthenticate' });
        });
    }

    logout(): boolean {
        FB.logout(response => {
            return true;
        });
        return;
    }

    updateList(fun: any[]) {
        if (fun !== undefined) {
            this.zone.run(() =>
                fun.map((object) => {

                    // Check only save groups you're administrator off.
                    if (object.administrator === true) {
                        this.listOfGrpups.push(object);
                    }
                }));
        }
    }

    retrieveGroups() {
        return this.listOfGrpups;
    }

    recursiveFunction(url: string) {
        if (this.isFirst) {
            url = '/' + this.userID + '?fields=groups{administrator,name}';
            FB.api(
                url,
                response => {

                    if (response && !response.error) {

                        this.updateList(response.groups.data);
                        if (response.groups.paging) {
                            this.isFirst = false;
                            this.recursiveFunction(response.groups.paging.next);

                        }
                    }
                },
            );
        } else {
            FB.api(
                url,
                response => {
                    if (response && !response.error) {
                        this.updateList(response.data);
                        if (response.paging.next) {
                            this.recursiveFunction(response.paging.next);
                        } else {
                            console.log('Done fetching groups!');
                        }
                    }
                },
            );
        }
    }

    // Recursive function too make sure all groups are collected
    doNewApiCAll(url: string) {

    }


}

