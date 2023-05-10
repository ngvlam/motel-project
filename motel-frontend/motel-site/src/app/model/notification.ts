import { Post } from "./post";


export class Notification {
  id!: number;
  post!: Post;
  seen!: boolean;
  createdAt!: string;
  unit!: string;
  notificationName!: string;
}
