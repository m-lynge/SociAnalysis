import {Injectable, NgZone} from '@angular/core';
import {DirectoryService} from './directory.service';
import {NewQuery} from "./NewQuery";
import {Query} from "./Query";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class FBServiceService {

    userID = '';
    isFirst = true;
    isFirstPosts = true;
    accessToken = '';
    listOfGroups = [];
    listOfPosts = [];
    hasRetrievedAllPosts = false;
    canRetrieve = false;


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
            console.log('submit login to facebook');
            FB.login((response) => {
                console.log('submitLogin', response);
                if (response.authResponse) {
                    // console.log(response.authResponse);
                    this.userID = response.authResponse.userID;
                    this.directoryService.selectedUser = response.authResponse.userID;
                    this.accessToken = response.authResponse.accessToken;
                    //  this.FetchGroups('');
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

    updateListOfGroups(groupListTemp: any[]) {
        if (groupListTemp !== undefined) {
            this.zone.run(() =>
                groupListTemp.map((group) => {
                    // Check only save groups you're administrator off.
                    if (group.administrator === true) {
                        this.listOfGroups.push(group);
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
        return this.listOfGroups;
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

    async getPosts(url) {
        const fragment = await (this.getPostFragment(url));
        if (fragment.nextPage) {
            return fragment.data.concat(await this.getPosts(fragment.nextPage));
        } else {
            return fragment.data;
        }
    }

    async getPostFragment(url) {
        let responsePlaceholder;
        FB.api(url, response => {
            if (response && !response.error) {
                responsePlaceholder = response;
                console.log(response);
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

    // FetchGroups(url?: string) {
    //
    //     FB.api(
    //         url,
    //         response => {
    //             if (response && !response.error) {
    //                 // this.updateListOfGroups(response.data);
    //                 this.updateListOfGroups(response.data);
    //                 console.log(response);
    //                 if (response.paging.next) {
    //                     this.FetchGroups(response.paging.next);
    //                 } else {
    //                     // console.log(this.listOfGroups);
    //                     this.hasRetrievedAllPosts = true;
    //                 }
    //             } else {
    //                 console.log(response.error);
    //             }
    //         },
    //     );
    // }

    DoSearchForPosts(newQuery: NewQuery) {
        const finalPosts = [];
        newQuery.groups.forEach((group, index, array) => {

            let limit = 0;
            newQuery.filter.max !== null ? limit = newQuery.filter.max : limit = 25;
            console.log(limit);

            const url = '/' + group.id + '/feed?fields=' + newQuery.params + '&limit=' + limit;

            this.getPosts(url).then((posts: any[]) => {
                this.directoryService.createQueryJSON(
                    this.directoryService.selectedUser,
                    this.directoryService.selectedProject,
                    new Query(newQuery.name, newQuery.params, newQuery.timeperiod, newQuery.groups, newQuery.filter, posts)
                );

                posts.forEach( (data) => {
                    finalPosts.push(data);
                });

                if (index === (array.length - 1)) {
                    this.router.navigate(['/projekt', newQuery.name]);
                }

            });
        });

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
                    console.log(response);
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

                        // const query = new Query(params.name, params.params, params.timeperiod, params.groups, params.filter, this.listOfPosts);
                        // console.log(this.listOfPosts);
                        // console.log('User: ' + this.directoryService.selectedUser);
                        // console.log('Project: ' + this.directoryService.selectedProject);
                    }
                } else {
                    console.log(response.error);
                }
            },
        );
    }

}

