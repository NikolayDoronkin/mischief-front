import {UserResponse} from "../user/user.response";
import {TaskResponse} from "../task/task.response";

export class Notification {
  constructor(
    public id: string,
    public template: string,
    public author: UserResponse,
    public receiver: UserResponse[],
    public relatedTicketId: string,
    public relatedTicket: TaskResponse,
    public created: Date
  ) {}
}
