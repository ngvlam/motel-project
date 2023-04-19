import { Accomodation } from "./accomodation";
import { User } from "./user";

export class Post {
    id?: number
    title?: string;
    content?: string;
    approved?: boolean;
    notApproved?: boolean;
    createdAt?: string;
    updatedAt?: string;
    del?: boolean;
    priority?: number;

    user?: User;
    accommodation?: Accomodation;
    imageStrings!: string[];
} 