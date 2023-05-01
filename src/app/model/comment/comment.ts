import {UserResponse} from "../user/user.response";
import {TaskResponse} from "../task/task.response";

export class Comment{
  constructor(
    public id: string,
    public author: UserResponse,
    public authorId: string,
    public created: Date,
    public updated: Date,
    public relatedTicket: TaskResponse,
    public value: string
  ) {}
}
