import { Group } from './Group';

export class NewQuery {
    constructor(
        public name: string,
        public params: string[],
        public timeperiod: {from: string, till: string},
        public groups: Group[],
        public filter: {max: number, tags: string[]}
    ) { }
}
