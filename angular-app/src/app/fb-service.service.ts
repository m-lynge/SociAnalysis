import {Injectable, NgZone} from '@angular/core';
import {DirectoryService} from './directory.service';
import {NewQuery} from "./NewQuery";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {Query} from "./Query";
@Injectable({
    providedIn: 'root'
})
export class FBServiceService {

    userName: Subject<string> = new Subject<string>();
    userID = '';
    accessToken = '';
    listOfPosts = [];

    constructor(private zone: NgZone, private directoryService: DirectoryService, private router: Router) {
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
            FB.login((response) => {
                if (response.authResponse) {
                    this.userID = response.authResponse.userID;
                    this.directoryService.selectedUser = response.authResponse.userID;
                    this.accessToken = response.authResponse.accessToken;

                    resolve(response.authResponse);

                } else {
                    reject('Login Failed');
                }
            }, {scope: 'groups_access_member_info'});
            // , auth_type: 'reauthenticate'
        });
    }

    logout(): boolean {
        FB.logout(response => {
            return true;
        });
        return;
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

    getAndSetUserName() {
        FB.api(
            '/me',
            response => {
                if (response && !response.error) {
                    this.userName.next(response.name);
                } else {
                    console.log(response.error);
                }
            },
        );
    }

    async wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getGroups(url) {
        const fragment = await (this.getGroupFragment(url))
        if (fragment.nextPage) {
            return fragment.data.concat(await this.getGroups(fragment.nextPage));
        } else {
            return fragment.data;
        }
    }

    async getGroupFragment(url) {
        let responsePlaceholder;
        FB.getLoginStatus((login) => {
            if (login.status === 'connected') {
                FB.api(url, response => {
                    if (response && !response.error) {
                        responsePlaceholder = response;
                    }
                });
            } else {
                console.error('User no longer logged in');
            }
        });


        while (!responsePlaceholder) {
            await this.wait(100);
        }

        return {
            data: responsePlaceholder.data,
            nextPage: responsePlaceholder.paging.next ? responsePlaceholder.paging.next : undefined
        };
    }

    async getApiCall(url) {
        const fragment = await (this.getApiCallFragment(url));
        if (fragment.nextPage) {
            return fragment.data.concat(await this.getApiCall(fragment.nextPage));
        } else {
            return fragment.data;
        }
    }

    async getApiCallFragment(url) {
        let responsePlaceholder;
        FB.api(url, response => {
            if (response && !response.error) {
                responsePlaceholder = response;
            }
        });

        while (!responsePlaceholder) {
            await this.wait(100);
        }
        return {
            data: responsePlaceholder.data,
            nextPage: responsePlaceholder.paging ? responsePlaceholder.paging.next : undefined
        };
    }

    async DoAPISearchForQuery(newQuery: NewQuery) {

        const promises = newQuery.groups.map(async groupCall => {
            let limit = 0;
            newQuery.filter.max !== null ? limit = newQuery.filter.max : limit = 100;
            const url = '/' + groupCall.id + '/feed?fields=' + newQuery.params + '&limit=' + limit;
            return this.getApiCall(url);
        });

        return await Promise.all(promises);


    }

    retrievePosts() {
        this.FetchPosts(
            '',
            '536165083455957',
            new NewQuery('default',
                ['message', 'comments', 'likes', 'reactions', 'picture', 'link'],
                {from: '', till: ''},
                [],
                {max: 100, tags: []}
            )
        );
    }

    FetchPosts(url: string, groupID: string, params: NewQuery) {
        if (groupID) {
            url = '/' + groupID + '/feed?fields=' + params.params.map((check) => {
                return check;
            }) + '&limit=100';
        }

        FB.api(
            url,
            response => {
                if (response && !response.error) {
                    this.updatePostList(response.data);
                    if (response.paging) {
                        this.FetchPosts(response.paging.next, '', params);
                    } else {
                        this.directoryService.createQueryJSON(
                            this.directoryService.selectedUser,
                            this.directoryService.selectedProject,
                            new Query(params.name, params.params, params.timeperiod, params.groups, params.filter, this.listOfPosts)
                        );
                        this.listOfPosts = [];
                    }
                } else {
                    console.log(response.error);
                }
            },
        );
    }
}
