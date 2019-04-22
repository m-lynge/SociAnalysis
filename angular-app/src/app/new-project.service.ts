import { Injectable } from "@angular/core";
import { Group } from './Group';

@Injectable({
  providedIn: "root"
})
export class NewProjectService {
  private name: string;
  private descr: string;
  private listOfGroups: Group[];

  public get Name(): string {
    return this.name;
  }
  public set Name(name: string) {
    this.name = name;
  }
  public get Description(): string {
    return this.descr;
  }
  public set Description(descr: string) {
    this.descr = descr;
  }

  public get ListOfGroups(): Group[] {
    return this.listOfGroups;
  }

  public set ListOfGroups(listOfGroups: Group[]) {
    this.listOfGroups = listOfGroups;
  }
}
