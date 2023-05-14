import { User } from "./user"

export class ChatMessage {
    id!: number;
    receiver!: User;
    messageContent!: string;
    sendAt!: Date;

}