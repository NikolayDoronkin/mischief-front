import {UserResponse} from "../user/user.response";
import {Project} from "../project/project";

export class TaskResponse {
  constructor(
    public id: string,
    public number: string,
    public title: string,
    public description: string,
    public assigneeId: string,
    public reporterId: string,
    public created: Date,
    public updated: Date,
    public relatableFinishedDate: Date,
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
  ) {
  }
}
