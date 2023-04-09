import { Accomodation } from "./accomodation";

export class Post {
    id?: number
    title?: string;
    content?: string;
    approved?: boolean;
    notApproved?: boolean;
    createdAt?: string;
    updatedAt?: string;
    del?: boolean;
    username?: string;
    accommodation?: Accomodation;
    imageStrings!: string[];
} 