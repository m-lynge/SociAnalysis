import { Injectable, NgZone } from '@angular/core';
import { DirectoryService } from './directory.service';
import { NewQuery } from "./NewQuery";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Query } from "./Query";
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
            }, { scope: 'groups_access_member_info' });
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
            // const url = '/' + groupCall.id + '/feed?fields=' + newQuery.params.map((check) => {
            //     if (check === 'comments') {
            //         if (newQuery.params.includes('likes')) {
            //             return (check + '{comments{reactions,message,created_time,permalink_url},reactions,message,created_time,permalink_url}');
            //         } else {
            //             return (check + '{comments{reactions')
            //         }
            //     } else {
            //         return check;
            //     }
            // }) + ',created_time,reactions' + '&limit=' + limit;
            const url = '/' + groupCall.id + '/feed?fields=' + newQuery.params.map((check) => {
                if (check !== 'comments') {
                    return check;
                }
                if (!newQuery.params.includes('message')){
                    return 'message,comments{message,' + newQuery.params.map((secondcheck) => {
                        if (secondcheck !== 'comments') {
                            return secondcheck;
                        } else {
                            return 'comments{message,' + newQuery.params.filter((thirdcheck) => {
                                if (thirdcheck !== 'comments') {
                                    return thirdcheck;
                                }
                            }) + ',created_time}';
                        }
                    }) + ',created_time}';
                }
                return 'comments{' + newQuery.params.map((secondcheck) => {
                    if (secondcheck !== 'comments') {
                        return secondcheck;
                    } else {
                        return 'comments{' + newQuery.params.filter((thirdcheck) => {
                            if (thirdcheck !== 'comments') {
                                return thirdcheck;
                            }
                        }) + ',created_time}';
                    }
                }) + ',created_time}';
            }) + ',created_time' + '&limit=' + limit;

            console.log('this is the url: ', url);
            return this.getApiCall(url);
        });

        return await Promise.all(promises);
    }

    filterQuery(queryData: any[], tags: string[], useDate: boolean, beginDate, endDate): any[] {
        // do filtering based on filter
        let filteredArray = queryData;

        if (tags && tags.length > 0) {
            filteredArray = this.filterByTag(tags, filteredArray);
        }

        if (useDate && beginDate !== '0' && endDate !== '0') {
            filteredArray = this.filterByDate(beginDate, endDate, filteredArray);
        }
        return filteredArray;
    }

    fixDate(date: number): string {
        let returnDate = '';
        if (date < 10) {
            returnDate = '0' + date;
        } else {
            returnDate = '' + date;
        }
        return returnDate;
    }

    filterByDate(beginDate, endDate, contentToFilter): any[] {
        return contentToFilter.filter((post: any) => {
            const returnBool = false;
            console.log('beginDate:', beginDate, ' , endDate:', endDate);
            console.log('post:', post.created_time.split('T')[0]);
            console.log(' is within:', this.withinDates(post.created_time.split('T')[0], beginDate, endDate));
            if (this.withinDates(post.created_time.split('T')[0], beginDate, endDate) === true) {
                return post;
            }
        });
    }
    withinDates(check: string, beginDate: string, endDate: string): boolean {
        const cDate = Date.parse(check);
        const bDate = Date.parse(beginDate);
        const eDate = Date.parse(endDate);

        if ((cDate <= eDate && cDate >= bDate)) {
            return true;
        }
        return false;
    }

    filterByTag(tags: string[], contentToFilter): any[] {
        const returnContent = contentToFilter.filter((post: any) => {
            // if post message
            let returnBool = false;
            tags.forEach((tag) => {
                if (post.hasOwnProperty('message')) {
                    if (post.message.includes(tag)) {
                        console.log('postmessage: ', post.message, ' - includes: ', tag);
                        returnBool = true;
                    }
                }
                if (returnBool !== true) {
                    // if comment message
                    if (post.hasOwnProperty('comments')) {
                        post.comments.data.forEach(comment => {
                            if (comment.hasOwnProperty('message')) {
                                if (comment.message.includes(tag)) {
                                    console.log('commentmessage: ', comment.message, ' - includes: ', tag);
                                    returnBool = true;
                                }
                            }
                            if (returnBool !== true) {
                                // if comment's commment message
                                if (comment.hasOwnProperty('comments')) {
                                    comment.comments.data.forEach(commentOfcomment => {
                                        if (commentOfcomment.hasOwnProperty('message')) {
                                            if (commentOfcomment.message.includes(tag)) {
                                                console.log('commentofcommentmessage: ',
                                                    commentOfcomment.message, ' - includes: ', tag);
                                                returnBool = true;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
            return returnBool;
        });
        return returnContent;
    }

}
