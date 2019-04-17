import { Group } from './Group';

export class Project {
    constructor(
        public name: string,
        public desc: string,
        public group: Group[]
    ) { }
}
