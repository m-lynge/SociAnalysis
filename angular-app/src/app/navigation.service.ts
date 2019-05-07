import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private naviIsActive: boolean;
  public backButtonIsActive: boolean;

  private goBackRoute: string[];
  private withinNewProject: boolean;

  get GoBackRoute(): string[] {
    return this.goBackRoute;
  }
  set GoBackRoute(newGoBackRoute: string[]) {
    this.goBackRoute = newGoBackRoute;
  }

  get WithinNewProject(): boolean {
    return this.withinNewProject;
  }
  set WithinNewProject(bool: boolean) {
    this.withinNewProject = bool;
  }



  constructor() {
  }
  public get getNavi(): boolean {
    return this.naviIsActive;
  }
  public set setNavi(boo: boolean) {
    this.naviIsActive = boo;
  }
}
