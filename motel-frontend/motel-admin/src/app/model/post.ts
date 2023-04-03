import { Accomodation } from "./accomodation";

export class Post {
    id?: number
    title?: string;
    content?: string;
    approved?: boolean;
    createAt?: string;
    updatedAt?: string;
    delete?: boolean;
    username?: string;
    accomodation?: Accomodation;
    imageStrings?: string[];
} 