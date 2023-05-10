import {UserResponse} from "../user/user.response";
import {Project} from "../project/project";
import {Comment} from "../comment/comment";

export class TaskResponse {
  constructor(
    public id: string,
    public number: string,
    public title: string,
    public description: string,
    public assigneeId: string,
    public reviewerId: string,
    public reporterId: string,
    public created: Date,
    public updated: Date,
    public relatableFinishedDate: string | null,
    public priorityName: string,
    public status: string,
    public relatedProjectId: string,
    public type: string,
    public parentTicketId: string,
    public reporter: UserResponse,
    public assignee: UserResponse,
    public reviewer: UserResponse,
    public listeners: UserResponse[],
    public accessableUsers: UserResponse[],
    public relatedProject: Project,
    public comments: Comment[],
    public difficulty: number
  ) {
  }
}
