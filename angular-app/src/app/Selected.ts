import { Group } from './Group';
interface ProjectInterface {
    name: string;
    desc: string;
    group: Group[];
}
export class Selected {
    constructor(
        public user: string,
        public project: string,
        public query: string
    ) { }
}
