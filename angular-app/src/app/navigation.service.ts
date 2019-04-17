import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private naviIsActive: boolean;
  constructor() {
  }
  public get getNavi(): boolean {
    return this.naviIsActive;
  }
  public setNavi(boo){
    console.log('Navigationbar: '+boo);
    this.naviIsActive = boo;
  }
}
