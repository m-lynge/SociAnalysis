import {Component} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {Group} from "../../Group";
import {FormControl} from "@angular/forms";


export interface SearchTag {
    tag: string;
}

@Component({
    selector: 'app-query-setting-view',
    templateUrl: './query-setting-view.component.html',
    styleUrls: ['./query-setting-view.component.css']
})

export class QuerySettingViewComponent {


    postsCheck = new FormControl(false);
    commentsCheck = new FormControl(false);
    likesCheck = new FormControl(false);
    reactionsCheck = new FormControl(false);
    picturesCheck = new FormControl(false);
    linksCheck = new FormControl(false);


    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

    searchTags: SearchTag[] = [];
    groupsAvailable: Group[] = [
        new Group('group1', 'Desc1'),
        new Group('group2', 'Desc2'),
        new Group('group3', 'Desc3'),
        new Group('group4', 'Desc4'),
    ];

    groupsSelected: Group[] = [];

    addToSelected(i: number) {
        this.groupsSelected.push(this.groupsAvailable[i]);
        this.groupsAvailable.splice(i, 1);
    }

    addToAvailable(i: number) {
        this.groupsAvailable.push(this.groupsSelected[i]);
        this.groupsSelected.splice(i, 1);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.searchTags.push({tag: value.trim()});
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(tag: SearchTag): void {
        const index = this.searchTags.indexOf(tag);

        if (index >= 0) {
            this.searchTags.splice(index, 1);
        }
    }

    StartQuery() {

        console.log(this.searchTags);

        console.log(
            'Posts: ' + this.postsCheck.value +
            '\n Comments: ' + this.commentsCheck.value +
            '\n Likes: ' + this.likesCheck.value +
            '\n Reactions: ' + this.reactionsCheck.value +
            '\n Pictures: ' + this.picturesCheck.value +
            '\n Links: ' + this.linksCheck.value
        );
    }

}
