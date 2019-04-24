import { Group } from './Group';

export class Query {
    constructor(
        public name: string,
        public params: string[],
        public timeperiod: { from: string, till: string },
        public groups: Group[],
        public filter: { max: number, tags: string[] },
        public fbData: [{name: string, data: object}]
    ) { }
}
