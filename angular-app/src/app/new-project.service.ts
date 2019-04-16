import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NewProjectService {

    name: string;
    descr: string;
    listOfGroups: string[];

    setName(name: string) {
        this.name = name;
    }

    setDescription(descr: string) {
        this.descr = descr;
    }

    setListOfGroups(listOfGroups: string[]) {
        this.listOfGroups = listOfGroups;
    }
}
