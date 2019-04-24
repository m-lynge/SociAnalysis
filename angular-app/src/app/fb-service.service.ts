import { Injectable, NgZone } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FBServiceService {

    userID = '';
    isFirst = true;
    isFirstPosts = true;
    accessToken = '';
    listOfGrpups = [];
    listOfPosts = [];

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
                    this.accessToken = response.authResponse.accessToken;
                    this.recursiveFunction('');
                    resolve('user: ' + response.authResponse);
                } else {
                    reject('Login Failed');
                }
            }, {scope: 'groups_access_member_info', auth_type: 'reauthenticate'});
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

    updatePostList(fun: any[]) {
        if (fun !== undefined) {
            this.zone.run(() =>
                fun.map((object) => {
                    // Check only save groups you're administrator off.
                    this.listOfPosts.push(object);
                }));
        }
    }


    retrieveGroups() {
        return this.listOfGrpups;
    }

    retrievePosts() {
        return this.listOfPosts;
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


    recursiveFunctionPosts(url: string, groupID: string) {
        if (this.isFirstPosts) {
            url = '/' + groupID + '/feed';
            FB.api(
                url,
           //     {access_token: this.accessToken},
                response => {

                    if (response && !response.error) {
                        console.log(response);

                        this.updatePostList(response.data);
                        if (response.paging) {
                            this.isFirstPosts = false;
                            this.recursiveFunctionPosts(response.paging.next, groupID);
                        }
                    }
                },
            );
        } else {
            FB.api(
                url,
                response => {
                    if (response && !response.error) {
                        this.updatePostList(response.data);
                        if (response.paging) {
                            this.recursiveFunctionPosts(response.paging.next, groupID);
                        } else {
                            console.log(this.listOfPosts);
                            console.log('Done fetching groups!');
                        }
                    }
                },
            );
        }
    }
}

