import { Accommodation } from "./accommodation";
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

    numberOfDays?: number;

    user?: User;
    accommodation!: Accommodation;
    imageStrings!: string[];
} 