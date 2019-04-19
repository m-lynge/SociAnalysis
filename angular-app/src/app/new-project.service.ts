import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NewProjectService {
  private name: string;
  private descr: string;
  private listOfGroups: string[];

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

  public set ListOfGroups(listOfGroups: string[]) {
    this.listOfGroups = listOfGroups;
  }
}
