import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private naviIsActive: boolean;
  private backButtonIsActive: boolean;
  constructor() {
  }
  public get getNavi(): boolean {
    return this.naviIsActive;
  }
  public set setNavi(boo: boolean) {
    this.naviIsActive = boo;
  }
}
