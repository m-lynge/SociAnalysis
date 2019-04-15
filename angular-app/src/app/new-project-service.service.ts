import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewProjectServiceService {


  private _name: string;
  private _descr: string;
  private _addedGroups: string[];

  constructor() { }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get descr(): string {
    return this._descr;
  }

  set descr(value: string) {
    this._descr = value;
  }

  get addedGroups(): string[] {
    return this._addedGroups;
  }

  set addedGroups(value: string[]) {
    this._addedGroups = value;
  }
}
